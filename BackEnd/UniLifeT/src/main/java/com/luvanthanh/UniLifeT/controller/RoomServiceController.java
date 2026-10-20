package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.entity.RoomServices;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/room_service")
public class RoomServiceController {

    @PostMapping
    public RoomServices save(@RequestBody RoomServices roomServices) {
        return null;
    }

}
