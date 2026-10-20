package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.roomRequest.RoomCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomRequest.RoomUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomResponse.RoomResponse;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.entity.Service;
import java.util.ArrayList;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface RoomMapper {
    @Mapping(target = "motel", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "userRooms", ignore = true)
    @Mapping(target = "roomAmenities", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "images", ignore = true)
    Room toRoom(RoomCreationRequest request);

    @Mapping(target = "motelId", source = "motel.motelId")
    @Mapping(target = "serviceIds", source = "services")
    RoomResponse toRoomResponse(Room room);

    @Mapping(target = "motel", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "userRooms", ignore = true)
    @Mapping(target = "roomAmenities", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "images", ignore = true)
    Room toRoomUpdate(@MappingTarget Room room, RoomUpdateRequest request);

    default List<Long> mapServicesToIds(List<Service> services) {
        List<Long> serviceIds = new ArrayList<>();
        for (Service service : services) {
            serviceIds.add(service.getServiceId());
        }
        return serviceIds;
    }
}
