using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.U2D;

public class SpriteShapeProps : MonoBehaviour
{
    private void InserPointNSmoothen(SpriteShapeController sc, Vector3 pointVector)
    {
        var spline = sc.spline;
        int newPointIndex = spline.GetPointCount();
        int pointIndex = newPointIndex - 1;
        spline.InsertPointAt(newPointIndex, pointVector);

        Vector3 position = sc.spline.GetPosition(pointIndex);
        Vector3 positionNext = sc.spline.GetPosition(SplineUtility.NextIndex(pointIndex, sc.spline.GetPointCount()));
        Vector3 positionPrev = sc.spline.GetPosition(SplineUtility.PreviousIndex(pointIndex, sc.spline.GetPointCount()));
        Vector3 forward = gameObject.transform.forward;

        float scale = Mathf.Min((positionNext - position).magnitude, (positionPrev - position).magnitude) * 0.33f;

        Vector3 leftTangent = (positionPrev - position).normalized * scale;
        Vector3 rightTangent = (positionNext - position).normalized * scale;

        sc.spline.SetTangentMode(pointIndex, ShapeTangentMode.Continuous);
        SplineUtility.CalculateTangents(position, positionPrev, positionNext, forward, scale, out rightTangent, out leftTangent);

        sc.spline.SetLeftTangent(pointIndex, leftTangent);
        sc.spline.SetRightTangent(pointIndex, rightTangent);
    }
    // Start is called before the first frame update
    void Start()
    {
        var spriteShapeController = gameObject.GetComponent<SpriteShapeController>();
        
        Vector3 newPt = new Vector3(3.0f, 0.2f, 0f);
        InserPointNSmoothen(spriteShapeController, newPt);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
