using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveCharacter : MonoBehaviour
{
    public Animator animator;
    public float speed = 50f;

    public LayerMask groundLayer;
    public Transform feetPos;

    private float jumpSpeed = 25f;
    private float movementX = 0f;
    private bool isGrounded;
    private float checkRadius = 0.3f;

    private Rigidbody2D rigidCharacter;
    

    void Start()
    {
        rigidCharacter = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate()
    {
        movementX = Input.GetAxis("Horizontal");

        Vector2 characterVelocity = rigidCharacter.velocity;
        float velocityX = Mathf.Abs(movementX * speed);

        rigidCharacter.velocity = new Vector2(velocityX, characterVelocity.y);

        animator.SetFloat("speed", velocityX);
    }

    void Update()
    {
        isGrounded = Physics2D.OverlapCircle(feetPos.position, checkRadius, groundLayer);
        if (isGrounded)
        {
            if (Input.GetKeyDown(KeyCode.UpArrow))
            {
                rigidCharacter.velocity = Vector2.up * jumpSpeed;
            }

            animator.SetBool("isJumping", false);
        } else
        {
            animator.SetBool("isJumping", true);
        }
    }
}
