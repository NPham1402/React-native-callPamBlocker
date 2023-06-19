package com.callspamblocker;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class SharePreferances {
    Context context;
    SharedPreferences pref;
    SharedPreferences.Editor editor;
    public  SharePreferances(Context context){
        this.context=context;
        this.pref=context.getSharedPreferences("com.callspamblocker",Context.MODE_PRIVATE);
        editor=this.pref.edit();
    }
    public boolean getSharePreferance(String key) {
        return pref.getBoolean(key,true);
    }
    public void setSharePreferance(String key,boolean status) {
        editor.putBoolean(key, status);
        editor.apply();
    }
    public String getAll() {
        Map<String,?> map = pref.getAll();
        JSONObject block=new JSONObject();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            map.forEach((k,v)->{
                try {
                    block.put(k,v);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }

               });
        }
            return block.toString();
    }
    public void setVariableDefault() {
        editor.putBoolean("notification", true);
        editor.putBoolean("block", true);
        editor.putBoolean("slient", true);
        editor.putBoolean("addBlock", true);
        editor.putBoolean("create", true);
        editor.apply();
    }
}

