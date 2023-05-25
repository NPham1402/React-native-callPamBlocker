package com.callspamblocker;

public class HistoryBlocked {
    public HistoryBlocked(String phone, int count) {
        Phone = phone;
        this.count = count;
    }

    public String getPhone() {
        return Phone;
    }

    public void setPhone(String phone) {
        Phone = phone;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    String Phone;
    int count;


}
