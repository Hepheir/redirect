import cv2

cap = cv2.VideoCapture(0)
key = cv2.waitKey(500)

while True:
    ret, frame = cap.read()
    cv2.imshow('cam', frame)
    key = cv2.waitKey(10)
    if key == ord('q'):
        break

cv2.destroyAllWindows()
cap.release()