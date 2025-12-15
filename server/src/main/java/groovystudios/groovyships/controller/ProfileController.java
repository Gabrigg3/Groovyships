package groovystudios.groovyships.controller;

import groovystudios.groovyships.dto.ProfileResponse;
import groovystudios.groovyships.dto.ProfileUpdateRequest;
import groovystudios.groovyships.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ProfileResponse getMyProfile(Authentication authentication) {
        return profileService.getMyProfile(authentication);
    }

    @PutMapping("/me")
    public ProfileResponse updateMyProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest request
    ) {
        return profileService.updateMyProfile(authentication, request);
    }
}

