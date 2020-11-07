using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class GameControls : MonoBehaviour
{
    public Animator animator;
    public GameObject coinBoard;
    void Start()
    {
        GameVariables.totalCoinsCollected = 0;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.touchCount > 0 || Input.GetKey(KeyCode.Space))
        {
            GameVariables.isPlaying = true;
            

            if (GameVariables.gameSpeed < GameVariables.gameMaxSpeed)
            {
                GameVariables.gameSpeed += GameVariables.gameSpeedStep;
            }
        } else
        {
            GameVariables.gameSpeed -= GameVariables.gameSpeedDamping * GameVariables.gameSpeed;
            if (GameVariables.gameSpeed < GameVariables.gameIdleLimitingSpeed)
            {
                GameVariables.isPlaying = false;
                GameVariables.gameSpeed = GameVariables.gameInitialSpeed;
            }
            
        }

        animator.SetBool("isPlaying", GameVariables.isPlaying);
        animator.SetFloat("animationSpeed", 0.2f + GameVariables.gameSpeed / GameVariables.animationToGameSpeedRatio);

        TextMeshProUGUI coinsObj = coinBoard.GetComponentInChildren<TextMeshProUGUI>();
        coinsObj.text = GameVariables.totalCoinsCollected.ToString();
    }
}
