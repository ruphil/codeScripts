using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MountainsMovement : MonoBehaviour
{
    public Camera cam;
    public GameObject mountainBack;
    public GameObject mountainMiddle;
    public GameObject mountainFront;

    public float gameSpeed = 1.0f;
    private Vector2 mountainBackInitialPos, mountainMiddleInitialPos, mountainFrontInitialPos;
    private float mountainBackLength, mountainMiddleLength, mountainFrontLength;
    void Start()
    {
        mountainBackInitialPos = mountainBack.transform.position;
        mountainMiddleInitialPos = mountainMiddle.transform.position;
        mountainFrontInitialPos = mountainFront.transform.position;

        mountainBackLength = mountainBack.GetComponent<SpriteRenderer>().bounds.size.x;
        mountainMiddleLength = mountainMiddle.GetComponent<SpriteRenderer>().bounds.size.x;
        mountainFrontLength = mountainFront.GetComponent<SpriteRenderer>().bounds.size.x;
        //Debug.Log(mountainBackLength);
        //Debug.Log(mountainMiddleLength);
        //Debug.Log(mountainFrontLength);
    }

    void Update()
    {
        if (GameVariables.isPlaying)
        {
            float mountainBackMovementStep = GameVariables.mountainBackStep * GameVariables.gameSpeed;
            float mountainMiddleMovementStep = GameVariables.mountainMiddleStep * GameVariables.gameSpeed;
            float mountainFrontMovementStep = GameVariables.mountainFrontStep * GameVariables.gameSpeed;

            float currentMountainBackPosX = mountainBack.transform.position.x + mountainBackMovementStep;
            float currentMountainMiddlePosX = mountainMiddle.transform.position.x + mountainMiddleMovementStep;
            float currentMountainFrontPosX = mountainFront.transform.position.x + mountainFrontMovementStep;

            mountainBack.transform.position = new Vector2(currentMountainBackPosX, mountainBack.transform.position.y);
            mountainMiddle.transform.position = new Vector2(currentMountainMiddlePosX, mountainMiddle.transform.position.y);
            mountainFront.transform.position = new Vector2(currentMountainFrontPosX, mountainFront.transform.position.y);

            if (cam.transform.position.x > currentMountainBackPosX + mountainBackLength)
            {
                mountainBack.transform.position = mountainBackInitialPos;
            }

            if (cam.transform.position.x > currentMountainMiddlePosX + mountainMiddleLength)
            {
                mountainMiddle.transform.position = mountainMiddleInitialPos;
            }

            if (cam.transform.position.x > currentMountainFrontPosX + mountainFrontLength)
            {
                mountainFront.transform.position = mountainFrontInitialPos;
            }

        }

    }
}
