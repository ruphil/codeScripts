using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoinsSpawning : MonoBehaviour
{
    public Camera cam;
    public GameObject coinsContainer;
    public GameObject coinsPrefab;

    private Vector2 coinsContainerInitialPos;
    private GameObject coins;
    void Start()
    {
        coinsContainerInitialPos = coinsContainer.transform.position;
    }

    void Update()
    {
        if (GameVariables.isPlaying)
        {
            float xPosPath = coinsContainer.transform.position.x;
            float coinsMovementStep = GameVariables.coinsMovementStep + GameVariables.coinsMovementStep / GameVariables.gameMaxSpeed * GameVariables.gameSpeed;

            coinsContainer.transform.position = new Vector2(xPosPath + coinsMovementStep, coinsContainer.transform.position.y);
            if (cam.transform.position.x > xPosPath + GameVariables.coinSpawnDist * (1 + GameVariables.gameSpeed / GameVariables.coinsSpawnDistToGameSpeedRatio))
            {
                coinsContainer.transform.position = coinsContainerInitialPos;

                Destroy(coins);

                coins = new GameObject("coins");
                coins.transform.SetParent(coinsContainer.transform);

                float yPosCoins = Random.Range(GameVariables.yMinCoinSpawn, GameVariables.yMaxCoinSpawn);
                for (int i = 0; i < GameVariables.numberOfCoinsToSpawn; i++)
                {
                    Instantiate(coinsPrefab, new Vector3(Random.Range(GameVariables.xMinCoinSpawn, GameVariables.xMaxCoinSpawn), yPosCoins, 0), Quaternion.identity, coins.transform);
                }
            }
        }
    }
}
