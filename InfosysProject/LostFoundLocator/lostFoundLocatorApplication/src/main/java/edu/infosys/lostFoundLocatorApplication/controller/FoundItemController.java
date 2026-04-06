package edu.infosys.lostFoundLocatorApplication.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;
import edu.infosys.lostFoundLocatorApplication.service.FoundItemService;
import edu.infosys.lostFoundLocatorApplication.service.LostfoundUserService;

@RestController
@RequestMapping("/lostfound")
@CrossOrigin(origins = "http://localhost:3535", allowCredentials = "true")
public class FoundItemController {

    @Autowired
    private FoundItemService service;

    @Autowired
    private LostfoundUserService userService;

    private static final String UPLOAD_DIR = "uploads/";

    // ================= SAVE =================
    @PostMapping("/founditem")
    public ResponseEntity<?> saveFoundItem(
            @RequestParam String itemName,
            @RequestParam String brand,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String location,
            @RequestParam String date,
            @RequestParam MultipartFile image) {

        try {

            File folder = new File(UPLOAD_DIR);
            if (!folder.exists()) folder.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
            Files.write(filePath, image.getBytes());

            String username = userService.getUserId();
            if (username == null) username = "guest";

            FoundItem item = new FoundItem();
            item.setItemName(itemName);
            item.setBrand(brand);
            item.setCategory(category);
            item.setDescription(description);
            item.setLocation(location);
            item.setDate(date);
            item.setImagePath(fileName);
            item.setPostedBy(username);
            item.setStatus(true);

            service.saveFoundItem(item);

            return ResponseEntity.ok("Saved");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // ================= 🔥 ROLE BASED FETCH =================
    @GetMapping("/founditem")
    public ResponseEntity<List<FoundItem>> getAllFoundItems() {

        String role = userService.getRole();
        String username = userService.getUserId();

        List<FoundItem> allItems = service.getAllFoundItems();

        // 🔥 fallback (no login issue)
        if (role == null || username == null) {
            return ResponseEntity.ok(allItems);
        }

        // 🔥 ADMIN → ALL
        if (role.equalsIgnoreCase("Admin")) {
            return ResponseEntity.ok(allItems);
        }

        // 🔥 STUDENT → ONLY THEIR ITEMS
        List<FoundItem> filtered = allItems.stream()
                .filter(item -> username.equals(item.getPostedBy()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }

    // ================= CLAIM =================
    @PostMapping("/founditem/claim/{id}")
    public ResponseEntity<?> claimItem(@PathVariable String id) {

        boolean result = service.claimItem(id);

        if (result) {
            return ResponseEntity.ok("Claimed Successfully");
        }

        return ResponseEntity.badRequest().body("Item not found");
    }

    // ================= IMAGE =================
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {

        Path path = Paths.get(UPLOAD_DIR).resolve(filename);
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Files.probeContentType(path)))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}