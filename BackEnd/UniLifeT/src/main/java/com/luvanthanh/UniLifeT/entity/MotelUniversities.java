package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

import java.util.ArrayList;
import java.util.List;

public class MotelUniversities {

    @ManyToMany
    @JoinTable(
            name = "motel_universities",
            joinColumns = @JoinColumn(name = "motel_id"),
            inverseJoinColumns = @JoinColumn(name = "university_id")
    )
    private List<University> universities = new ArrayList<>();

}
