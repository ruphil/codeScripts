using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameVariables : MonoBehaviour
{
    public static bool isGameOver = false;
    public static int lifeHeads = 3;
    public static float cactusSpawnDist = 120f;

    public static float coyoteMovementStep = -0.2f;
    public static float coyoteSpawnDist = 240f;

    public static float characterJumpForce = 25f;
    public static bool canCharacterJump = true;

    public static float gameSpeed = 1.0f;
    public static float animationToGameSpeedRatio = 8;
    public static float gameSpeedDamping = 0.01f;
    public static float gameIdleLimitingSpeed = 1.1f;
    public static float gameInitialSpeed = 1.0f;
    public static float gameMaxSpeed = 30f;
    public static float sprintMinSpeed = 16f;
    public static float gameSpeedStep = 0.003f;
    //public static float gameSpeedStep = 0.01f;
    
    public static float coinSpawnDist = 100f;
    public static float coinsSpawnDistToGameSpeedRatio = 32;
    public static float xMinCoinSpawn = 30f;
    public static float xMaxCoinSpawn = 90f;
    public static float yMinCoinSpawn = -1.0f;
    public static float yMaxCoinSpawn = 0f;
    public static int numberOfCoinsToSpawn = 10;
    public static int totalCoinsCollected = 0;
    public static float coinsMovementStep = -0.1f;

    public static float mountainBackStep = -0.01f;
    public static float mountainMiddleStep = -0.02f;
    public static float mountainFrontStep = -0.03f;
    public static float stageStep = mountainFrontStep;
    public static float stageLength = 200f;

    public static bool isPlaying = false;
}
