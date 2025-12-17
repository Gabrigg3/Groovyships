package groovystudios.groovyships.controller.v0;

import groovystudios.groovyships.dto.v0.ProfileResponse;
import groovystudios.groovyships.dto.v0.ProfileUpdateRequest;
import groovystudios.groovyships.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/v0/profile")
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

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyAccount(Authentication authentication) {
        profileService.deleteMyAccount(authentication);
    }

}

