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
    private static final String KEY_IDPhoneName = "Phone";
    private static final String KEY_Count = "count";
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
        String create_blockHistory = String.format("CREATE TABLE %s(%s TEXT,%s INTEGER)", TABLE_NAME2,KEY_IDPhoneName,KEY_Count);
        String create_Settings = String.format("CREATE TABLE settings(Key TEXT,Value INTEGER)" );
        sqLiteDatabase.execSQL(create_blockHistory);
        sqLiteDatabase.execSQL(create_Settings);
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
        String query = "SELECT * FROM " + TABLE_NAME +" where phoneNumber= '"+numberPhone+"'";
        boolean check=true;
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(query, null);
        if(cursor.getCount()<=0) {
            check = false;
        }
                   return check;

    }

    public void unBlockPhone(String id) {
        String strSQL = "Delete from blockphone WHERE id = '"+ id+"'";
        SQLiteDatabase db = this.getReadableDatabase();
        db.execSQL(strSQL);
        db.close();
    }
    public void unBlockPhoneWithPhone(String phone) {
        String strSQL = "Delete from blockphone WHERE phoneNumber = '"+ phone+"'";
        SQLiteDatabase db = this.getReadableDatabase();
        db.execSQL(strSQL);
        db.close();
    }
    public void blockPhone(String id) {
        String strSQL = "UPDATE blockphone SET status = true WHERE id = '"+ id+"'";
        SQLiteDatabase db = this.getReadableDatabase();
        db.execSQL(strSQL);
        db.close();
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


        db.close();
        return blockPhone;
    }

    public int getCountPhoneBlock() {
        String query = "SELECT id,name,phoneNumber,status FROM " + TABLE_NAME ;

        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(query, null);
        db.close();
        return cursor.getCount();
    }

    public void deleteAllWattingLine() {
        SQLiteDatabase db = this.getWritableDatabase();

        db.delete(TABLE_NAME2,null,null);
        db.close();
    }
    public boolean WattingLineExists() {
        SQLiteDatabase db = this.getReadableDatabase();
        String sql = "SELECT EXISTS (SELECT * FROM blockHistory LIMIT 1)";
        Cursor cursor = db.rawQuery(sql, null);
        cursor.moveToFirst();

        // cursor.getInt(0) is 1 if column with value exists
        if (cursor.getInt(0) == 1) {
            cursor.close();
            return true;
        } else {
            cursor.close();
            return false;
        }
    }

    public String getAllWattingLine() throws JSONException {
        String query = "SELECT Phone,count from " + TABLE_NAME2;
        JSONArray array=new JSONArray();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(query, null);
        cursor.moveToFirst();
        while(cursor.isAfterLast() == false) {

            JSONObject object=new JSONObject();
            object.put("phone",cursor.getString(0));
            object.put("count",cursor.getInt(1));
                array.put(object);
            cursor.moveToNext();

        }
        db.close();
     return array.toString();
    }

    public void addWattingLine(String number) {
        SQLiteDatabase dbWrite = this.getWritableDatabase();
        SQLiteDatabase dbRead = this.getReadableDatabase();
        String query = "SELECT * from " + TABLE_NAME2 +" where Phone ='"+number+"'";

        Cursor cursor = dbRead.rawQuery(query, null);
        if(cursor.getCount() <= 0){
            ContentValues values = new ContentValues();
            values.put(KEY_IDPhoneName, number);
            values.put(KEY_Count, 1);
            dbWrite.insert(TABLE_NAME2, null, values);
        }
        else{

            cursor.moveToFirst();
            int count=cursor.getInt(1)+1;
            Log.e("count",count+"");
            String query_update = "update "+ TABLE_NAME2 +" set count = "+count+ " where Phone ='"+number+"'";
            dbWrite.execSQL(query_update);

        }

        dbWrite.close();
        dbRead.close();
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
        db.close();
        return array;
    }

}
