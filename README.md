### Тестовая программа на Typescript соединения двух прямоугольников

Реализует функцию с интерфейсом,
которая принимает на вход два прямоугольника и два подсоединения (точка с углом), и возвращает массив точек для дальнейшей отрисовки.

```typescript
type DataConverter = (
  rect1: Rect, 
  rect2: Rect, 
  cPoint1: ConnectionPoint, 
  cPoint2: ConnectionPoint
) =>  Point[];

type Point = {
  x: number;
  y: number;
};
type Size = {
  width: number;
  height: number;
};
type Rect = {
  position: Point; // координата центра прямоугольника
  size: Size;
};
type ConnectionPoint = {
  point: Point;
  angle: number; // угол в градусах
};
```
#### Разработка/тестирование приложения
- установка ```yarn install```
- запуск ```yarn start```

Приложение позволяет перетаскивать прямоугольники по окну,
а также можно менять точку подсоединения селектами в нижней части экрана
