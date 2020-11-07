using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CreateJerries : MonoBehaviour
{
    public GameObject jerry;
    private int numberOfJerries = 10;
    // Start is called before the first frame update
    void Start()
    {
        for (int i = 0; i < numberOfJerries; i++)
        {
            GameObject j = Instantiate(jerry) as GameObject;
            j.transform.position = new Vector2(Random.Range(-10.0f, 10.0f), Random.Range(-4.0f, 4.0f));
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
