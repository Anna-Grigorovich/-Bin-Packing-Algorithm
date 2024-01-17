class BinPacking {
  // Конструктор класса, инициализирует корневой узел с размерами контейнера
  constructor(w, h) {
    this.root = { x: 0, y: 0, w: w, h: h };
  }

  // Метод упаковки прямоугольников в контейнер
  pack(rectangles) {
    let n, node, rectangle;
    let sortRectangles = this.sort(rectangles);

    // Перебираем отсортированные прямоугольники
    for (n = 0; n < sortRectangles.length; n++) {
      rectangle = sortRectangles[n];

      // Пытаемся найти подходящий узел для текущего прямоугольника
      if (
        (node = this.findNode(this.root, rectangle.width, rectangle.height))
      ) {
        // Если узел найден, разбиваем его на два узла: сверху и справа от текущего прямоугольника
        rectangle.fit = this.splitNode(node, rectangle.width, rectangle.height);
      }
    }
    return rectangles;
  }

  // Рекурсивный метод поиска узла для размещения прямоугольника
  findNode(root, w, h) {
    if (root.used) {
      // Если узел уже занят, ищем среди его потомков
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    } else if (w <= root.w && h <= root.h) {
      // Если узел свободен и достаточно большой, возвращаем его
      return root;
    } else {
      // В противном случае, узел не подходит
      return null;
    }
  }

  // Метод разделения узла на два подузла
  splitNode(node, w, h) {
    node.used = true;
    node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
    node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
    return node;
  }

  // Метод сортировки прямоугольников по высоте
  sort(rectangles) {
    let rotateRectangles = this.rotate(rectangles);
    return rotateRectangles.sort((a, b) => {
      if (a.height > b.height) {
        return 1;
      }
      if (a.height < b.height) {
        return -1;
      }
      return 0;
    });
  }

  // Метод поворота прямоугольников
  rotate(rectangles) {
    return rectangles.map((rectangle) => {
      if (rectangle.width > rectangle.height) {
        // Если ширина больше высоты, меняем их местами и добавляем флаг поворота
        let w = rectangle.width;
        rectangle.width = rectangle.height;
        rectangle.height = w;
        rectangle.rotate = true;
      }
      return rectangle;
    });
  }

  // Метод вычисления коэффициента использования пространства
  calculateSpaceUtilization(rectangles) {
    let totalArea = this.root.w * this.root.h;
    let usedArea = 0;

    rectangles.forEach((rect) => {
      if (rect.fit) {
        usedArea += rect.width * rect.height;
      }
    });

    return usedArea / totalArea;
  }

  // Метод получения информации об оптимальном распределении
  getOptimalLayoutInfo(rectangles) {
    let optimalLayout = {
      fullness: 0,
      blockCoordinates: [],
    };

    // Клонируем прямоугольники, чтобы не модифицировать оригинальные данные
    let cloneRectangles = rectangles.map((rect) => ({ ...rect }));

    // Выполняем упаковку прямоугольников
    this.pack(cloneRectangles);

    let totalArea = this.root.w * this.root.h;
    let usedArea = 0;

    // Формируем информацию об оптимальном распределении
    cloneRectangles.forEach((rect) => {
      if (rect.fit) {
        usedArea += rect.width * rect.height;

        optimalLayout.blockCoordinates.push({
          top: rect.fit.y,
          left: rect.fit.x,
          right: rect.fit.x + rect.width,
          bottom: rect.fit.y + rect.height,
          initialOrder: rect.initialOrder,
        });
      }
    });

    optimalLayout.fullness = usedArea / totalArea;

    return optimalLayout;
  }
}
