using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SpeedBar : MonoBehaviour
{
    public RectTransform PS_Holder;
    public Image circle;

    void Update()
    {
        float progress = GameVariables.gameSpeed / GameVariables.gameMaxSpeed;
        circle.fillAmount = progress;
        PS_Holder.rotation = Quaternion.Euler(new Vector3(0f, 0f, -progress * 360));
    }
}
