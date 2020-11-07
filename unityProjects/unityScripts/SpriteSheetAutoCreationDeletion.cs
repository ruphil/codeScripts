using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.U2D;

public class SpriteShapeProps : MonoBehaviour
{
    public GameObject cam;

    private float xPosFirst;
    private float xPosLast;

    private float cameraWidth;
    private float xCamExtentRight;
    private float xCamExtentLeft;
    void Start()
    {
        Camera camera = Camera.main;
        float halfHeight = camera.orthographicSize;
        cameraWidth = 2 * camera.aspect * halfHeight;

        createMorePoints(5);
        setLastPosition();
    }

    void FixedUpdate()
    {
        deletePointsOutOfCamera();

        xCamExtentRight = cam.transform.position.x + cameraWidth;
        if (xCamExtentRight > xPosLast)
        {
            createMorePoints(3);
        }

        setLastPosition();

        //string displayStr = " Camera Right: " + xCamExtentRight.ToString();
        //displayStr += " Camera Left: " + xCamExtentLeft.ToString();
        //displayStr += " Spline XFirst: " + xPosFirst.ToString();
        //displayStr += " Spline XLast: " + xPosLast.ToString();
        //Debug.Log(displayStr);
    }

    private void setLastPosition()
    {
        SpriteShapeController sscCopy = gameObject.GetComponent<SpriteShapeController>();
        Spline spline = sscCopy.spline;
        int totalPoints = spline.GetPointCount();

        int lastPoint = totalPoints - 1;
        xPosLast = spline.GetPosition(lastPoint).x;
    }

    private void deletePointsOutOfCamera()
    {
        SpriteShapeController sscCopy = gameObject.GetComponent<SpriteShapeController>();
        Spline spline = sscCopy.spline;
        xPosFirst = spline.GetPosition(0).x;

        xCamExtentLeft = cam.transform.position.x - cameraWidth;
        if (xPosFirst < xCamExtentLeft)
        {
            spline.RemovePointAt(0);
        }
    }

    private void createMorePoints(int numPointsToInsert)
    {
        SpriteShapeController ssc = gameObject.GetComponent<SpriteShapeController>();
        Spline spline = ssc.spline;
        float xPos = spline.GetPosition(spline.GetPointCount() - 1).x;
        for (int i = 0; i < numPointsToInsert; i++)
        {
            xPos = xPos + Random.Range(3.0f, 5.0f);
            Vector3 newPt = new Vector3(xPos, Random.Range(-0.5f, 1.0f), 0f);
            InserPointNSmoothen(ssc, newPt);
        }
    }

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
}
