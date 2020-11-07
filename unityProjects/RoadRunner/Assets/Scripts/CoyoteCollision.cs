using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoyoteCollision : MonoBehaviour
{
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if(collision.gameObject.name == "RR")
        {
            GameVariables.canCharacterJump = false;
            StartCoroutine(restoreJumpState());
        }
    }

    IEnumerator restoreJumpState()
    {
        yield return new WaitForSeconds(2);
        GameVariables.canCharacterJump = true;
    }
}
