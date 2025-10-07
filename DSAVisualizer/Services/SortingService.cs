using DSAVisualizer.Models;
using System.Diagnostics;

namespace DSAVisualizer.Services
{
    public class SortingService
    {
        private List<AlgorithmStep> _steps = new();
        private int _comparisons;
        private int _swaps;

        public AlgorithmResponse BubbleSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());

            for (int i = 0; i < arr.Count - 1; i++)
            {
                bool swapped = false;
                for (int j = 0; j < arr.Count - i - 1; j++)
                {
                    _comparisons++;
                    AddStep(arr, $"Comparing {arr[j]} and {arr[j + 1]}", new List<int> { j, j + 1 });

                    if (arr[j] > arr[j + 1])
                    {
                        (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
                        _swaps++;
                        swapped = true;
                        AddStep(arr, $"Swapped {arr[j + 1]} and {arr[j]}", new List<int> { j, j + 1 }, "red");
                    }
                }
                if (!swapped) break;
            }

            AddStep(arr, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Bubble Sort",
                Comparisons = _comparisons,
                Swaps = _swaps,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        public AlgorithmResponse SelectionSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());

            for (int i = 0; i < arr.Count - 1; i++)
            {
                int minIdx = i;
                AddStep(arr, $"Finding minimum from index {i}", new List<int> { i }, "blue");

                for (int j = i + 1; j < arr.Count; j++)
                {
                    _comparisons++;
                    AddStep(arr, $"Comparing with {arr[j]}", new List<int> { minIdx, j });
                    if (arr[j] < arr[minIdx])
                    {
                        minIdx = j;
                    }
                }

                if (minIdx != i)
                {
                    (arr[i], arr[minIdx]) = (arr[minIdx], arr[i]);
                    _swaps++;
                    AddStep(arr, $"Swapped {arr[minIdx]} with {arr[i]}", new List<int> { i, minIdx }, "red");
                }
            }

            AddStep(arr, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Selection Sort",
                Comparisons = _comparisons,
                Swaps = _swaps,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        public AlgorithmResponse InsertionSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());

            for (int i = 1; i < arr.Count; i++)
            {
                int key = arr[i];
                int j = i - 1;

                AddStep(arr, $"Inserting {key} into sorted portion", new List<int> { i }, "blue");

                while (j >= 0 && arr[j] > key)
                {
                    _comparisons++;
                    arr[j + 1] = arr[j];
                    _swaps++;
                    AddStep(arr, $"Moving {arr[j]} to the right", new List<int> { j, j + 1 });
                    j--;
                }
                arr[j + 1] = key;
                AddStep(arr, $"Inserted {key} at position {j + 1}", new List<int> { j + 1 }, "green");
            }

            AddStep(arr, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Insertion Sort",
                Comparisons = _comparisons,
                Swaps = _swaps,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        public AlgorithmResponse MergeSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());
            MergeSortRecursive(arr, 0, arr.Count - 1);
            AddStep(arr, "Array sorted!", new List<int>(), "green");

            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Merge Sort",
                Comparisons = _comparisons,
                Swaps = _swaps,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        private void MergeSortRecursive(List<int> arr, int left, int right)
        {
            if (left < right)
            {
                int mid = left + (right - left) / 2;

                AddStep(arr, $"Dividing array from {left} to {right}", Enumerable.Range(left, right - left + 1).ToList(), "blue");

                MergeSortRecursive(arr, left, mid);
                MergeSortRecursive(arr, mid + 1, right);
                Merge(arr, left, mid, right);
            }
        }

        private void Merge(List<int> arr, int left, int mid, int right)
        {
            var leftArr = arr.Skip(left).Take(mid - left + 1).ToList();
            var rightArr = arr.Skip(mid + 1).Take(right - mid).ToList();

            int i = 0, j = 0, k = left;

            while (i < leftArr.Count && j < rightArr.Count)
            {
                _comparisons++;
                if (leftArr[i] <= rightArr[j])
                {
                    arr[k] = leftArr[i];
                    i++;
                }
                else
                {
                    arr[k] = rightArr[j];
                    j++;
                }
                AddStep(arr, $"Merging elements at position {k}", new List<int> { k }, "green");
                k++;
            }

            while (i < leftArr.Count)
            {
                arr[k] = leftArr[i];
                AddStep(arr, $"Copying remaining element {leftArr[i]}", new List<int> { k });
                i++;
                k++;
            }

            while (j < rightArr.Count)
            {
                arr[k] = rightArr[j];
                AddStep(arr, $"Copying remaining element {rightArr[j]}", new List<int> { k });
                j++;
                k++;
            }
        }

        public AlgorithmResponse QuickSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());
            QuickSortRecursive(arr, 0, arr.Count - 1);
            AddStep(arr, "Array sorted!", new List<int>(), "green");

            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Quick Sort",
                Comparisons = _comparisons,
                Swaps = _swaps,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        private void QuickSortRecursive(List<int> arr, int low, int high)
        {
            if (low < high)
            {
                int pi = Partition(arr, low, high);
                QuickSortRecursive(arr, low, pi - 1);
                QuickSortRecursive(arr, pi + 1, high);
            }
        }

        private int Partition(List<int> arr, int low, int high)
        {
            int pivot = arr[high];
            AddStep(arr, $"Pivot selected: {pivot}", new List<int> { high }, "purple");

            int i = low - 1;

            for (int j = low; j < high; j++)
            {
                _comparisons++;
                AddStep(arr, $"Comparing {arr[j]} with pivot {pivot}", new List<int> { j, high });

                if (arr[j] < pivot)
                {
                    i++;
                    (arr[i], arr[j]) = (arr[j], arr[i]);
                    _swaps++;
                    AddStep(arr, $"Swapped {arr[j]} and {arr[i]}", new List<int> { i, j }, "red");
                }
            }

            (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
            _swaps++;
            AddStep(arr, $"Placed pivot at position {i + 1}", new List<int> { i + 1 }, "green");

            return i + 1;
        }

        public AlgorithmResponse HeapSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());
            int n = arr.Count;

            // Build max heap
            for (int i = n / 2 - 1; i >= 0; i--)
            {
                Heapify(arr, n, i);
            }

            // Extract elements from heap
            for (int i = n - 1; i > 0; i--)
            {
                (arr[0], arr[i]) = (arr[i], arr[0]);
                _swaps++;
                AddStep(arr, $"Moved max element {arr[i]} to position {i}", new List<int> { 0, i }, "red");

                Heapify(arr, i, 0);
            }

            AddStep(arr, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Heap Sort",
                Comparisons = _comparisons,
                Swaps = _swaps,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        private void Heapify(List<int> arr, int n, int i)
        {
            int largest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;

            if (left < n)
            {
                _comparisons++;
                if (arr[left] > arr[largest])
                    largest = left;
            }

            if (right < n)
            {
                _comparisons++;
                if (arr[right] > arr[largest])
                    largest = right;
            }

            if (largest != i)
            {
                (arr[i], arr[largest]) = (arr[largest], arr[i]);
                _swaps++;
                AddStep(arr, $"Heapifying: swapped {arr[largest]} with {arr[i]}", new List<int> { i, largest });
                Heapify(arr, n, largest);
            }
        }

        private void AddStep(List<int> array, string description, List<int> highlightIndices, string color = "yellow")
        {
            _steps.Add(new AlgorithmStep
            {
                StepNumber = _steps.Count + 1,
                Array = new List<int>(array),
                Description = description,
                HighlightIndices = highlightIndices,
                HighlightColor = color
            });
        }

        public AlgorithmResponse CountingSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());

            if (arr.Count == 0) return new AlgorithmResponse { Steps = _steps };

            int max = arr.Max();
            int min = arr.Min();
            int range = max - min + 1;
            var count = new int[range];
            var output = new int[arr.Count];

            // Count occurrences
            for (int i = 0; i < arr.Count; i++)
            {
                count[arr[i] - min]++;
                AddStep(arr, $"Counting {arr[i]}", new List<int> { i });
            }

            // Modify count array
            for (int i = 1; i < count.Length; i++)
            {
                count[i] += count[i - 1];
            }

            // Build output array
            for (int i = arr.Count - 1; i >= 0; i--)
            {
                output[count[arr[i] - min] - 1] = arr[i];
                count[arr[i] - min]--;
                var currentOutput = output.Take(arr.Count).ToList();
                AddStep(currentOutput, $"Placing {arr[i]} in output", new List<int>());
            }

            var result = output.ToList();
            AddStep(result, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Counting Sort",
                Comparisons = _comparisons,
                Swaps = 0,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        public AlgorithmResponse BucketSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());

            if (arr.Count == 0) return new AlgorithmResponse { Steps = _steps };

            int max = arr.Max();
            int min = arr.Min();
            int bucketCount = 5;
            var buckets = new List<List<int>>();

            for (int i = 0; i < bucketCount; i++)
            {
                buckets.Add(new List<int>());
            }

            // Distribute elements into buckets
            for (int i = 0; i < arr.Count; i++)
            {
                int bucketIndex = (arr[i] - min) * bucketCount / (max - min + 1);
                if (bucketIndex >= bucketCount) bucketIndex = bucketCount - 1;
                buckets[bucketIndex].Add(arr[i]);
                AddStep(arr, $"Adding {arr[i]} to bucket {bucketIndex}", new List<int> { i });
            }

            // Sort individual buckets and concatenate
            var sortedArr = new List<int>();
            for (int i = 0; i < bucketCount; i++)
            {
                buckets[i].Sort();
                _comparisons += buckets[i].Count;
                sortedArr.AddRange(buckets[i]);
                AddStep(sortedArr, $"Sorted bucket {i} and added to result", new List<int>());
            }

            AddStep(sortedArr, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Bucket Sort",
                Comparisons = _comparisons,
                Swaps = 0,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        public AlgorithmResponse RadixSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());

            if (arr.Count == 0) return new AlgorithmResponse { Steps = _steps };

            int max = arr.Max();

            for (int exp = 1; max / exp > 0; exp *= 10)
            {
                CountingSortByDigit(arr, exp);
            }

            AddStep(arr, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Radix Sort",
                Comparisons = _comparisons,
                Swaps = 0,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }

        private void CountingSortByDigit(List<int> arr, int exp)
        {
            var output = new int[arr.Count];
            var count = new int[10];

            for (int i = 0; i < arr.Count; i++)
            {
                count[(arr[i] / exp) % 10]++;
            }

            for (int i = 1; i < 10; i++)
            {
                count[i] += count[i - 1];
            }

            for (int i = arr.Count - 1; i >= 0; i--)
            {
                output[count[(arr[i] / exp) % 10] - 1] = arr[i];
                count[(arr[i] / exp) % 10]--;
            }

            for (int i = 0; i < arr.Count; i++)
            {
                arr[i] = output[i];
            }

            AddStep(arr, $"Sorted by digit at position {exp}", new List<int>());
        }

        public AlgorithmResponse ShellSort(List<int> array)
        {
            _steps = new();
            _comparisons = 0;
            _swaps = 0;
            var arr = new List<int>(array);
            var sw = Stopwatch.StartNew();

            AddStep(arr, "Initial array", new List<int>());

            int n = arr.Count;
            for (int gap = n / 2; gap > 0; gap /= 2)
            {
                AddStep(arr, $"Current gap: {gap}", new List<int>());

                for (int i = gap; i < n; i++)
                {
                    int temp = arr[i];
                    int j;

                    for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                    {
                        _comparisons++;
                        arr[j] = arr[j - gap];
                        _swaps++;
                        AddStep(arr, $"Comparing elements at distance {gap}", new List<int> { j, j - gap });
                    }

                    arr[j] = temp;
                    if (j != i)
                    {
                        AddStep(arr, $"Inserted {temp} at position {j}", new List<int> { j }, "green");
                    }
                }
            }

            AddStep(arr, "Array sorted!", new List<int>(), "green");
            sw.Stop();

            return new AlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Shell Sort",
                Comparisons = _comparisons,
                Swaps = _swaps,
                ExecutionTimeMs = sw.ElapsedMilliseconds
            };
        }
    }
}