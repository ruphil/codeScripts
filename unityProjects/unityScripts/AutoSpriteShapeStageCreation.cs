using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.U2D;

public class SpriteShapeProps : MonoBehaviour
{
    private void InserPointNSmoothen(SpriteShapeController sc, Vector3 pointVector)
    {
        Spline spline = sc.spline;
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
        SpriteShapeController ssc = gameObject.GetComponent<SpriteShapeController>();
        Spline spline = ssc.spline;

        int numPointsToInsert = 30;

        float xPos = spline.GetPosition(spline.GetPointCount() - 1).x;
        
        for (int i = 0; i < numPointsToInsert; i++)
        {
            xPos = xPos + Random.Range(0f, 5.0f);
            Vector3 newPt = new Vector3(xPos, Random.Range(-1.0f, 1.0f), 0f);
            InserPointNSmoothen(ssc, newPt);
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
