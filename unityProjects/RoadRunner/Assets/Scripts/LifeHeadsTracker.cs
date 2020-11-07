using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LifeHeadsTracker : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(GameVariables.lifeHeads > 0)
        {
            GameObject.Find("/LifeHeads/GameOver").transform.localScale = new Vector2(0f, 0f);
        } else
        {
            GameOver();
        }
    }

    void GameOver()
    {
        GameObject.Find("/LifeHeads/GameOver").transform.localScale = new Vector2(1f, 1f);
        GameVariables.totalCoinsCollected = 0;

        StartCoroutine(ResetGameAfterSeconds());
    }

    IEnumerator ResetGameAfterSeconds()
    {
        yield return new WaitForSeconds(5);

        GameObject.Find("/LifeHeads/GameOver").transform.localScale = new Vector2(0f, 0f);
        GameVariables.lifeHeads = 3;

        GetHeadsBack();
    }

    void GetHeadsBack()
    {
        for(int i = 1; i <= 3; i++)
        {
            string currentLifeHeadStr = "/LifeHeads/Heads/head" + i.ToString();
            GameObject.Find(currentLifeHeadStr).transform.localScale = new Vector2(5f, 5f);
        }
    }
}
