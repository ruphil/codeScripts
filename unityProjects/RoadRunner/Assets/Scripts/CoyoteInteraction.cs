using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoyoteInteraction : MonoBehaviour
{
    public Camera cam;
    public GameObject characterContainer;
    public GameObject coyoteContainer;
    public GameObject coyotePrefab;

    private Vector2 coyoteContainerInitialPos;
    private GameObject coyote;
    private float cameraWidth;
    private bool coyoteGoneTrigger;
    private int coyoteGoneNum;
    private bool characterToBeAdjusted;
    private bool characterOutTriggerOnce;
    private bool lifeToBeReduced;
    void Start()
    {
        coyote = new GameObject("coyote");
        coyote.transform.SetParent(coyoteContainer.transform);

        coyoteContainerInitialPos = coyoteContainer.transform.position;
        coyoteGoneNum = 0;
        coyoteGoneTrigger = false;
        lifeToBeReduced = false;
        characterOutTriggerOnce = false;
    }

    void Update()
    {
        if (GameVariables.isPlaying)
        {
            float xPosPath = coyoteContainer.transform.position.x;
            float coyoteMovementStep = GameVariables.coyoteMovementStep + GameVariables.coyoteMovementStep / GameVariables.gameMaxSpeed * GameVariables.gameSpeed;

            coyoteContainer.transform.position = new Vector2(xPosPath + coyoteMovementStep, coyoteContainer.transform.position.y);
            if (cam.transform.position.x > xPosPath + GameVariables.coyoteSpawnDist)
            {
                coyoteContainer.transform.position = coyoteContainerInitialPos;

                Destroy(coyote);

                coyote = new GameObject("coyote");
                coyote.transform.SetParent(coyoteContainer.transform);

                Instantiate(coyotePrefab, new Vector3(100, 0, 0), Quaternion.identity, coyote.transform);
                coyoteGoneTrigger = true;
            }
        }

        if (coyoteGoneTrigger)
        {
            if (-150 > coyoteContainer.transform.position.x)
            {
                ++coyoteGoneNum;
                //Debug.Log("Coyote Gone: " + coyoteGoneNum.ToString());
                coyoteGoneTrigger = false;
                characterToBeAdjusted = true;
                characterOutTriggerOnce = true;
            }
        }

        if (characterToBeAdjusted)
        {
            float characterXPosition = characterContainer.transform.position.x;
            if (characterXPosition < -5.0f)
            {
                characterContainer.transform.position = new Vector2(characterXPosition + 0.1f, characterContainer.transform.position.y);
            }
            else
            {
                characterToBeAdjusted = false;
            }
        }

        if (-15 > characterContainer.transform.position.x)
        {
            if (characterOutTriggerOnce)
            {
                //Debug.Log("Character Out");
                lifeToBeReduced = true;
                characterOutTriggerOnce = false;
            }
        }

        if (lifeToBeReduced && GameVariables.lifeHeads > 0)
        {
            lifeToBeReduced = false;

            //Debug.Log("Life Reduced");
            string currentLifeHeadStr = "/LifeHeads/Heads/head" + GameVariables.lifeHeads.ToString();
            GameObject.Find(currentLifeHeadStr).transform.localScale = new Vector2(0f, 0f);
            GameVariables.lifeHeads--;

            ResetNGameCharacter();
        }

        void ResetNGameCharacter()
        {
            characterContainer.transform.position = new Vector2(-5.0f, characterContainer.transform.position.y);
            GameVariables.gameSpeed = GameVariables.gameInitialSpeed;
        }
    }
}
