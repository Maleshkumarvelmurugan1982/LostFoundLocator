package edu.infosys.lostFoundLocatorApplication.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import edu.infosys.lostFoundLocatorApplication.bean.LostItem;
import edu.infosys.lostFoundLocatorApplication.service.LostItemService;
import edu.infosys.lostFoundLocatorApplication.service.LostfoundUserService;

@RestController
@RequestMapping("/lostfound")
@CrossOrigin(origins = "http://localhost:3535", allowCredentials = "true")
public class LostItemController {

    @Autowired
    private LostItemService lostService;

    @Autowired
    private LostfoundUserService userService;

    private static final String UPLOAD_DIR = "uploads/";

    // ================= SAVE LOST ITEM =================
    @PostMapping("/lostitem")
    public ResponseEntity<?> saveLostItem(
            @RequestParam("itemName") String itemName,
            @RequestParam("brand") String brand,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("date") String date,
            @RequestParam("image") MultipartFile file) {

        try {

            File folder = new File(UPLOAD_DIR);
            if (!folder.exists()) folder.mkdir();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
            Files.write(filePath, file.getBytes());

            LostItem item = new LostItem();

            item.setItemName(itemName);
            item.setBrand(brand);
            item.setCategory(category);
            item.setDescription(description);
            item.setLocation(location);
            item.setDate(date);
            item.setImagePath(fileName);

            // ✅ SAFE USERNAME SET
            String username = userService.getUserId();
            if (username == null || username.equals("anonymousUser")) {
                username = "guestUser";
            }

            item.setPostedBy(username);
            item.setStatus(true);

            lostService.saveLostItem(item);

            return ResponseEntity.ok("Lost Item Saved Successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ================= GET ALL LOST ITEMS =================
    @GetMapping("/lostitem")
    public List<LostItem> getLostItems() {
        return lostService.getAllLostItems(); // ✅ Always return all
    }

    // ================= DELETE =================
    @DeleteMapping("/lostitem/{id}")
    public void deleteLostItem(@PathVariable String id) {
        lostService.deleteLostItemById(id);
    }
 // ================= UPDATE LOST ITEM =================
    @PutMapping("/lostitem")
    public ResponseEntity<?> updateLostItem(@RequestBody LostItem lostItem) {

        lostService.saveLostItem(lostItem);  // save() works for update also

        return ResponseEntity.ok("Lost Item Updated Successfully");
    }
}