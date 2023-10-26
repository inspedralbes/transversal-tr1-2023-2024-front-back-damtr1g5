package com.example.takeaway;

import retrofit2.Call;
import retrofit2.http.GET;

public interface ProductesApi {
    @GET("/getProductes")
    Call<Product> getProductes();
    /*@POST("/sendRespostes")
    Call<Void> sendRespostes(@Body Respostes respostes);*/
}
