const ROLE_URL='http://localhost:9595/lostfound/role';
const USER_URL='http://localhost:9595/lostfound/user';
const LOGOUT_URL ='http://localhost:9595/lostfound/logout';
const STD_URL='http://localhost:9595/lostfound/student';
const ME_URL='http://localhost:9595/lostfound/me';
package edu.infosys.lostFoundLocatorApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/lostfound")
@CrossOrigin(origins = "http://localhost:3535", allowCredentials = "true")
public class LoginController {

    @Autowired
    private LostfoundUserService service;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ================= REGISTER =================
    @PostMapping("/register")
    public void registerNewUser(@RequestBody LostfoundUser user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        service.saveUser(user);
    }

    // ================= LOGIN =================
    @GetMapping("/login/{userId}/{password}")
    public String validateUser(@PathVariable String userId,
                               @PathVariable String password) {

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(userId, password)
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // After authentication, your service stores user + role
            return service.getRole();

        } catch (Exception ex) {
            return "false";
        }
    }

    // ================= GET USER DETAILS =================
    @GetMapping("/login")
    public LostfoundUser getUserDetails() {
        return service.getUser();
    }

    // ================= DELETE USER =================
    @DeleteMapping("/login/{username}")
    public void deleteUser(@PathVariable String username) {
        service.deleteUser(username);
    }

    // ================= GET CURRENT USERNAME =================
    @GetMapping("/user")
    public String getUserId() {
        return service.getUserId();
    }

    // ================= GET CURRENT ROLE =================
    @GetMapping("/role")
    public String getRole() {
        return service.getRole();
    }

    // ================= GET FULL USER =================
    @GetMapping("/me")
    public LostfoundUser getUser() {
        return service.getUser();
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request,
                                         HttpServletResponse response) {

        SecurityContextHolder.clearContext();

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logout successful");
    }
}

