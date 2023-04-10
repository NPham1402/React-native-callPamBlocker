package com.callspamblocker;

import androidx.annotation.Nullable;

import org.jetbrains.annotations.NotNull;

public class GsmCall {

    @NotNull
    private final Status status;
    @org.jetbrains.annotations.Nullable
    private final String displayName;

    @NotNull
    public final Status getStatus() {
        return this.status;
    }

    @org.jetbrains.annotations.Nullable
    public final String getDisplayName() {
        return this.displayName;
    }

    public GsmCall(@NotNull Status status, @Nullable String displayName) {
        super();
        this.status = status;
        this.displayName = displayName;
    }

    public enum  Status {
        CONNECTING,
        DIALING,
        RINGING,
        ACTIVE,
        DISCONNECTED,
        UNKNOWN
    }
}
