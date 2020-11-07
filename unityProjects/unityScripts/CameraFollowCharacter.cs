using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollowCharacter : MonoBehaviour
{
    public GameObject cam;

    void Update()
    {   
        cam.transform.position = new Vector3(transform.position.x, cam.transform.position.y, cam.transform.position.z);
    }
}
