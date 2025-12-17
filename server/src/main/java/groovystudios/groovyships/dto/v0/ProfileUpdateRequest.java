package groovystudios.groovyships.dto.v0;

import java.util.List;

public record ProfileUpdateRequest(
        String name,
        Integer age,
        String gender,
        String occupation,
        String location,
        String bio,
        List<String> lookingFor,
        List<String> interestedInGenderRomance,
        List<String> interestedInGenderFriendship,
        Integer ageRangeMin,
        Integer ageRangeMax,
        List<String> interests,
        List<String> photos
) {}
