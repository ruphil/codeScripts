using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StageMovement : MonoBehaviour
{
    public Camera cam;
    public GameObject spritePath;

    private Vector2 spritePathInitialPos;

    void Start()
    {
        spritePathInitialPos = spritePath.transform.position;
    }

    // Update is called once per frame
    void Update()
    {
        if (GameVariables.isPlaying)
        {
            float xPosPath = spritePath.transform.position.x;
            float stageMovementStep = GameVariables.stageStep * GameVariables.gameSpeed;

            spritePath.transform.position = new Vector2(xPosPath + stageMovementStep, spritePath.transform.position.y);
            if (cam.transform.position.x > xPosPath + GameVariables.stageLength)
            {
                spritePath.transform.position = spritePathInitialPos;
            }
        }
    }
}
