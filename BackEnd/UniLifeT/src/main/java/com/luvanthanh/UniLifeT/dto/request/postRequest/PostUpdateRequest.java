package com.luvanthanh.UniLifeT.dto.request.postRequest;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateRequest {
    private Long userId;
    private Long roomId;
    private String postTitle;
    private String postContent;
    private Date postCreateAt;
    private String postStatus;
    private int postView;
}
