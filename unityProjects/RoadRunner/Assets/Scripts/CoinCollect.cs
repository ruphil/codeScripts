using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoinCollect : MonoBehaviour
{
    private void OnTriggerEnter2D(Collider2D collision)
    {
        Destroy(gameObject);

        if(collision.gameObject.name == "RR")
        {
            GameVariables.totalCoinsCollected += 1;
        }
    }
}
