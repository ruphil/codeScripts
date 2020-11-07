using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SkyMovement : MonoBehaviour
{
    private float length, startpos;
    public GameObject cam;
    //private float skyMovementSpeed = -0.005f;
    private float skyMovementSpeed = -0.05f;

    void Start()
    {
        startpos = transform.position.x;
        length = GetComponent<SpriteRenderer>().bounds.size.x;
        Debug.Log(length.ToString());
    }


    void FixedUpdate()
    {
        float camPosition = (cam.transform.position.x);

        transform.position = new Vector3(startpos, transform.position.y, transform.position.z);
        startpos += skyMovementSpeed;
        if (camPosition > startpos + length) startpos = 0;
    }
}
