#include <iostream>
#include <fstream>

using namespace std;

int main() {
    setlocale(LC_ALL, "Russian");

    // Читаем input
    ifstream fin("input.txt");
    if (!fin.is_open()) {
        cout << "Ошибка: не удалось открыть файл input.txt" << endl;
        return 1;
    }

    int N; // Сколько точек указано в файле
    fin >> N;
    if (N < 2) {
        cout << "Ошибка: для интерполяции нужно минимум 2 точки." << endl;
        return 1;
    }

    // Выделяем динамическую память под массивы координат
    double* X = new double[N];
    double* Y = new double[N];

    // Парсим файл для получения изначальных точек
    for (int i = 0; i < N; ++i) {
        fin >> X[i] >> Y[i];
    }

    double xmin, xmax;
    int M; // Сколько точек выведет скрипт
    fin >> xmin >> xmax >> M;
    fin.close();

    if (M < 2) {
        cout << "Ошибка: количество точек аппроксимации должно быть >= 2." << endl;
        delete[] X;
        delete[] Y;
        return 1;
    }

    // Открываем файл для записи результатов
    ofstream fout("output.csv");
    if (!fout.is_open()) {
        cout << "Ошибка: не удалось создать файл output.csv" << endl;
        delete[] X;
        delete[] Y;
        return 1;
    }

    // Настраиваем формат вывода: фиксированная запятая, 6 знаков после неё
    fout.setf(ios::fixed);
    fout.precision(6);

    // Заголовок для корректного импорта (разделитель , )
    fout << "x,y" << endl;

    // Шаг сетки на отрезке
    double step = (xmax - xmin) / (M - 1);

    // 4. Основной цикл: вычисляем полином Лагранжа в каждой точке сетки
    for (int i = 0; i < M; ++i) {
        double x = xmin + i * step;
        double y = 0.0; // Здесь будем накапливать значение полинома

        // Формула Лагранжа: P(x) = Σ Y[j] * L_j(x)
        for (int j = 0; j < N; ++j) {
            double L_j = Y[j]; // Начинаем с коэффициента Y[j]

            // Вычисляем базисный многочлен L_j(x) = Π (x - X[k]) / (X[j] - X[k])
            for (int k = 0; k < N; ++k) {
                if (j != k) { // Пропускаем случай деления на ноль
                    L_j *= (x - X[k]) / (X[j] - X[k]);
                }
            }
            y += L_j; // Прибавляем слагаемое к итоговому значению
        }

        // Записываем точку в файл
        fout << x << "," << y << endl;
    }

    fout.close();

    // 5. Освобождаем динамическую память
    delete[] X;
    delete[] Y;

    cout << "Готово! Результаты успешно сохранены в output.csv" << endl;
    return 0;
}