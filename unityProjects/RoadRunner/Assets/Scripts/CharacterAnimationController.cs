using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterAnimationController : MonoBehaviour
{
    public GameObject characterObj;
    public Animator animator;
    public LayerMask groundLayer;
    public Transform feetPos;
    public ParticleSystem dustParticles;
    public ParticleSystem flameParticles;

    private Rigidbody2D rigidCharacter;
    private float checkRadius = 0.3f;
    private bool isGrounded;
    void Start()
    {
        rigidCharacter = characterObj.GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        if (GameVariables.gameSpeed >= GameVariables.sprintMinSpeed)
        {
            GameObject.Find("/Character/RR/Leftleg").transform.localScale = new Vector2(0f, 0f);
            GameObject.Find("/Character/RR/Rightleg").transform.localScale = new Vector2(0f, 0f);

            GameObject.Find("/Character/RR/RRsprint").transform.localScale = new Vector2(1f, 1f);
        } else
        {
            GameObject.Find("/Character/RR/Leftleg").transform.localScale = new Vector2(1f, 1f);
            GameObject.Find("/Character/RR/Rightleg").transform.localScale = new Vector2(1f, 1f);

            GameObject.Find("/Character/RR/RRsprint").transform.localScale = new Vector2(0f, 0f);
        }

        isGrounded = Physics2D.OverlapCircle(feetPos.position, checkRadius, groundLayer);
        if (isGrounded && GameVariables.canCharacterJump)
        {
            if (Input.touchCount > 1 || Input.GetKey(KeyCode.J))
            {
                rigidCharacter.velocity = Vector2.up * GameVariables.characterJumpForce;
            }
        }

        if (isGrounded)
        {
            animator.SetBool("isJumping", false);
        } else
        {
            animator.SetBool("isJumping", true);
        }

        bool isJumping = animator.GetBool("isJumping");
        if (!isJumping && GameVariables.gameSpeed > GameVariables.gameMaxSpeed / 3 && GameVariables.gameSpeed < GameVariables.gameMaxSpeed * 2 / 3) 
        {
            if (!dustParticles.isPlaying)
            {
                dustParticles.Play();
            }
        } else
        {
            if (dustParticles.isPlaying)
            {
                dustParticles.Stop();
            }
        }

        if (!isJumping && GameVariables.gameSpeed > GameVariables.gameMaxSpeed * 2 / 3)
        {
            if (!flameParticles.isPlaying)
            {
                flameParticles.Play();
            }
        }
        else
        {
            if (flameParticles.isPlaying)
            {
                flameParticles.Stop();
            }
        }
    }
}
