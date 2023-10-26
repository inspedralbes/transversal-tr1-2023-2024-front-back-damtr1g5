package com.example.takeaway;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class Product {

    @SerializedName("id")
    private int id;
    @SerializedName("nom")
    private String nom;
    @SerializedName("descripció")
    private String descripcio;
    @SerializedName("preu")
    private float preu;
    @SerializedName("url_imatge")
    private String url_imatge;

    @SerializedName("result")
    private List<Product> productes;

    public List<Product> getProductes() {
        return productes;
    }

    public Product(String url_imatge, String nom, String descripcio, float preu) {
        this.url_imatge = url_imatge;
        this.nom = nom;
        this.descripcio = descripcio;
        this.preu = preu;
    }
    public float getGetPreu() {
        return preu;
    }

    public String getUrl_imatge() {
        return url_imatge;
    }

    public String getNom() {
        return nom;
    }

    public String getDescripcio() {
        return descripcio;
    }

}
