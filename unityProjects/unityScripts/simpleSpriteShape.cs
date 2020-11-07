using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.U2D;

public class SpriteShapeProps : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        var spriteShapeController = gameObject.GetComponent<SpriteShapeController>();
        var spline = spriteShapeController.spline;

        int newPointIndex = spline.GetPointCount();
        Debug.Log(newPointIndex);

        for (int i = 0; i < newPointIndex; i++)
        {
            Debug.Log(spline.GetPosition(i));
        }

        Vector3 newPt = new Vector3(3.0f, 0.2f, 0f);
        spline.InsertPointAt(newPointIndex, newPt);
        spline.SetTangentMode(newPointIndex - 1, ShapeTangentMode.Continuous);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
