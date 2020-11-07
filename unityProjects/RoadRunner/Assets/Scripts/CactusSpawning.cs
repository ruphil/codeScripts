using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CactusSpawning : MonoBehaviour
{
    public Camera cam;
    public GameObject cactusContainer;
    public GameObject[] cactusPrefab;

    private Vector2 cactusContainerInitialPos;
    private GameObject cactus;
    void Start()
    {
        cactusContainerInitialPos = cactusContainer.transform.position;
    }

    void Update()
    {
        if (GameVariables.isPlaying)
        {
            float xPosPath = cactusContainer.transform.position.x;
            float cactusMovementStep = GameVariables.stageStep * GameVariables.gameSpeed;

            cactusContainer.transform.position = new Vector2(xPosPath + cactusMovementStep, cactusContainer.transform.position.y);
            if (cam.transform.position.x > xPosPath + GameVariables.cactusSpawnDist)
            {
                cactusContainer.transform.position = cactusContainerInitialPos;

                Destroy(cactus);

                cactus = new GameObject("cactus");
                cactus.transform.SetParent(cactusContainer.transform);

                int randomCactusPrefab = Random.Range(0, 3);
                for (int i = 0; i < 1; i++)
                {
                    Instantiate(cactusPrefab[randomCactusPrefab], new Vector3(Random.Range(20f, 60f), -2f, 0), Quaternion.identity, cactus.transform);
                }
            }
        }
    }
}
