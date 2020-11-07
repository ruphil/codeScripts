using System;
using UnityEngine;

public class MoveCharacter : MonoBehaviour
{
    public float speed = 5f;

    private Rigidbody2D rigidCharacter;
    private float movementX = 0f;
    private float movementY = 0f;
    private Vector3 directionFacing;

    void Start()
    {
        rigidCharacter = GetComponent<Rigidbody2D>();
        Debug.Log("Hello Unity");
    }

    void FixedUpdate()
    {
        movementX = Input.GetAxis("Horizontal");
        movementY = Input.GetAxis("Vertical");
        //Debug.Log(movement.ToString());
        rigidCharacter.velocity = new Vector2(movementX * speed, movementY * speed);

        // Only for Characters
        //directionFacing = transform.eulerAngles;
        //if (movementX > 0)
        //{
        //    transform.eulerAngles = new Vector3(0, 0, 0);
        //}
        //else if (movementX < 0)
        //{
        //    transform.eulerAngles = new Vector3(0, 180, 0);
        //}
    }
}
