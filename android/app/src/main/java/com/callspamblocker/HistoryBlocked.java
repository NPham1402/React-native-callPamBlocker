package com.callspamblocker;

public class HistoryBlocked {
    String idPhone;
    String TimeStamp;

    public HistoryBlocked(String idPhone, String timeStamp) {
        this.idPhone = idPhone;
        TimeStamp = timeStamp;
    }

    public String getIdPhone() {
        return idPhone;
    }

    public void setIdPhone(String idPhone) {
        this.idPhone = idPhone;
    }

    public String getTimeStamp() {
        return TimeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        TimeStamp = timeStamp;
    }
}
