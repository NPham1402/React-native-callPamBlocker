package com.callspamblocker;

public class BlockPhone {
    String id;
    String name;
    String phoneNumber;
    Boolean status;

    public BlockPhone(String id, String name, String phoneNumber ) {
        super();
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = true;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
