package com.callspamblocker;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.provider.CallLog;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class DatabaseHandler extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "BlockPhoneManager";
    private static final int DATABASE_VERSION = 1;
    private static final String TABLE_NAME = "blockphone";
    private static final String TABLE_NAME2 = "blockHistory";
    private static final String KEY_IDPhoneName = "idPhone";
    private static final String KEY_TIMESTAMP = "timeStamp";
    private static final String KEY_ID = "id";

    private static final String KEY_NAME = "name";
    private static final String KEY_STATUS = "status";
    private static final String KEY_PHONE_NUMBER = "phoneNumber";

    private final static AtomicInteger c = new AtomicInteger(0);

    public static int getID() {
        return c.incrementAndGet();
    }



    public DatabaseHandler(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        String create_students_table = String.format("CREATE TABLE %s(%s TEXT PRIMARY KEY, %s TEXT, %s TEXT, %s BOOLEAN)", TABLE_NAME, KEY_ID, KEY_NAME, KEY_PHONE_NUMBER, KEY_STATUS);
        String create_blockHistory = String.format("CREATE TABLE %s(%s TEXT , %s TEXT)", TABLE_NAME2,KEY_IDPhoneName,KEY_TIMESTAMP);
        sqLiteDatabase.execSQL(create_blockHistory);
        sqLiteDatabase.execSQL(create_students_table);

    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {
        String drop_students_table = String.format("DROP TABLE IF EXISTS %s", TABLE_NAME);
        String drop_students_table2 = String.format("DROP TABLE IF EXISTS %s", TABLE_NAME2);
        sqLiteDatabase.execSQL(drop_students_table);
        sqLiteDatabase.execSQL(drop_students_table2);

        onCreate(sqLiteDatabase);

    }
    public void addBlockPhone(String id, String name,String phone) {
        SQLiteDatabase db = this.getWritableDatabase();

        if(checkStudent(phone)==false){

            ContentValues values = new ContentValues();
            values.put(KEY_NAME,name);
            values.put(KEY_ID, id);
            values.put(KEY_PHONE_NUMBER, phone);
            values.put(KEY_STATUS,true);
            db.insert(TABLE_NAME, null, values);

        }
        else{
            blockPhone(getId(phone));
        }
        db.close();
    }
    public String getId(String numberPhone) {
        SQLiteDatabase db = this.getReadableDatabase();

        Cursor cursor = db.query(TABLE_NAME, null, KEY_PHONE_NUMBER + " = ?", new String[] { String.valueOf(numberPhone) },null, null, null);
        if(cursor != null) {
            cursor.moveToFirst();
            BlockPhone number = new BlockPhone(cursor.getString(0), cursor.getString(1), cursor.getString(2));

            return number.id;
        }
        return "" ;
    }


    public boolean checkStudent(String numberPhone) {
        SQLiteDatabase db = this.getReadableDatabase();

        boolean check=true;
        Cursor cursor = db.query(TABLE_NAME, null, KEY_PHONE_NUMBER + " = ?" , new String[] { String.valueOf(numberPhone) },null, null, null);

        if(cursor.getCount()<=0) {

            check = false;
        }
            return check;
    }

    public void unBlockPhone(String id) {
        String strSQL = "UPDATE blockphone SET status = false WHERE id = '"+ id+"'";
        SQLiteDatabase db = this.getReadableDatabase();
        db.execSQL(strSQL);

    }

    public void blockPhone(String id) {
        String strSQL = "UPDATE blockphone SET status = true WHERE id = '"+ id+"'";
        SQLiteDatabase db = this.getReadableDatabase();
        db.execSQL(strSQL);

    }

    public JSONArray getAllBlockPhone() {
        String query = "SELECT id,name,phoneNumber,status FROM " + TABLE_NAME ;

        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(query, null);
        cursor.moveToFirst();
        JSONArray blockPhone=new JSONArray();
        while(cursor.isAfterLast() == false) {

            String id = cursor.getString(0);
            String name = cursor.getString(1);
            String phoneNumber = cursor.getString(2);
            boolean value = cursor.getInt(3) > 0;
            Log.e("cc",cursor.getString(0) +" ");
            if(value==false){
                cursor.moveToNext();
            }
            else{

            try {
                JSONObject block=new JSONObject();
                block.put("displayName", name);
               block.put("id", id);
               block.put("number", phoneNumber);
                blockPhone.put(block);
           } catch (JSONException e) {
               throw new RuntimeException(e);
           }


            cursor.moveToNext();
        }
        }



        return blockPhone;
    }





    public JSONArray getAllHistory() throws JSONException {
        String query = "SELECT idPhone,name,phoneNumber,timeStamp,status FROM " + TABLE_NAME2+", "+TABLE_NAME+" where idPhone=id";
        JSONArray array=new JSONArray();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(query, null);
        cursor.moveToFirst();
        while(cursor.isAfterLast() == false) {
            boolean value = cursor.getInt(4) > 0;

            if(value==true) {
                JSONObject object = new JSONObject();
                object.put("id", cursor.getString(0));
                object.put("Name", cursor.getString(1));
                object.put("Number", cursor.getString(2));
                object.put("Date", cursor.getString(3));
                object.put("Duration", 5);
                array.put(object);
            }
            cursor.moveToNext();

        }
     return array;
    }

    public void addBlockHistory(String number) {
        SQLiteDatabase db = this.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put(KEY_IDPhoneName, getId(number));
        values.put(KEY_TIMESTAMP, String.valueOf(TimeUnit.MILLISECONDS.toSeconds(System.currentTimeMillis())));

        db.insert(TABLE_NAME2, null, values);
        db.close();
    }

    public JSONArray getAllPhoneHistoryBlocked(String numberPhone) {
        String query = "SELECT timeStamp FROM " + TABLE_NAME2+", "+TABLE_NAME+" Where id=idPhone and phoneNumber="+numberPhone;
        JSONArray array=new JSONArray();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(query, null);
        cursor.moveToFirst();

        while(cursor.isAfterLast() == false) {
            JSONObject object=new JSONObject();
            try {
                object.put("TimeStamp",cursor.getString(0));
                array.put(object);

            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
            cursor.moveToNext();


        }
        return array;
    }

}
