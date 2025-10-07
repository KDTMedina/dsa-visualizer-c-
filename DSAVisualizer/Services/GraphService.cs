using DSAVisualizer.Models;

namespace DSAVisualizer.Services
{
    public class GraphService
    {
        private List<GraphAlgorithmStep> _steps = new();

        public GraphAlgorithmResponse BreadthFirstSearch(Graph graph, string startNode)
        {
            _steps = new();
            var visited = new HashSet<string>();
            var queue = new Queue<string>();
            var visitOrder = new List<string>();

            queue.Enqueue(startNode);
            visited.Add(startNode);

            AddStep(new List<string>(), new List<GraphEdge>(), $"Starting BFS from node {startNode}");

            while (queue.Count > 0)
            {
                var node = queue.Dequeue();
                visitOrder.Add(node);

                AddStep(new List<string> { node }, new List<GraphEdge>(), $"Visiting node {node}");

                var neighbors = graph.Edges
                    .Where(e => e.Source == node || (!e.IsDirected && e.Target == node))
                    .Select(e => e.Source == node ? e.Target : e.Source)
                    .ToList();

                foreach (var neighbor in neighbors)
                {
                    if (!visited.Contains(neighbor))
                    {
                        queue.Enqueue(neighbor);
                        visited.Add(neighbor);

                        var edge = graph.Edges.First(e =>
                            (e.Source == node && e.Target == neighbor) ||
                            (!e.IsDirected && e.Source == neighbor && e.Target == node));

                        AddStep(visited.ToList(), new List<GraphEdge> { edge },
                            $"Discovered node {neighbor} from {node}");
                    }
                }
            }

            AddStep(visited.ToList(), new List<GraphEdge>(), "BFS Complete!");

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Breadth-First Search",
                Result = new Dictionary<string, object>
                {
                    { "VisitOrder", visitOrder },
                    { "NodesVisited", visited.Count }
                }
            };
        }

        public GraphAlgorithmResponse DepthFirstSearch(Graph graph, string startNode)
        {
            _steps = new();
            var visited = new HashSet<string>();
            var visitOrder = new List<string>();

            AddStep(new List<string>(), new List<GraphEdge>(), $"Starting DFS from node {startNode}");
            DFSRecursive(graph, startNode, visited, visitOrder);
            AddStep(visited.ToList(), new List<GraphEdge>(), "DFS Complete!");

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Depth-First Search",
                Result = new Dictionary<string, object>
                {
                    { "VisitOrder", visitOrder },
                    { "NodesVisited", visited.Count }
                }
            };
        }

        private void DFSRecursive(Graph graph, string node, HashSet<string> visited, List<string> visitOrder)
        {
            visited.Add(node);
            visitOrder.Add(node);
            AddStep(visited.ToList(), new List<GraphEdge>(), $"Visiting node {node}");

            var neighbors = graph.Edges
                .Where(e => e.Source == node || (!e.IsDirected && e.Target == node))
                .Select(e => e.Source == node ? e.Target : e.Source)
                .ToList();

            foreach (var neighbor in neighbors)
            {
                if (!visited.Contains(neighbor))
                {
                    var edge = graph.Edges.First(e =>
                        (e.Source == node && e.Target == neighbor) ||
                        (!e.IsDirected && e.Source == neighbor && e.Target == node));

                    AddStep(visited.ToList(), new List<GraphEdge> { edge },
                        $"Exploring edge {node} -> {neighbor}");

                    DFSRecursive(graph, neighbor, visited, visitOrder);
                }
            }
        }

        public GraphAlgorithmResponse DijkstraShortestPath(Graph graph, string startNode, string endNode)
        {
            _steps = new();
            var distances = new Dictionary<string, int>();
            var previous = new Dictionary<string, string>();
            var unvisited = new HashSet<string>();

            // Initialize
            foreach (var node in graph.Nodes)
            {
                distances[node.Id] = int.MaxValue;
                unvisited.Add(node.Id);
            }
            distances[startNode] = 0;

            AddStep(new List<string>(), new List<GraphEdge>(),
                $"Starting Dijkstra's algorithm from {startNode} to {endNode}", distances);

            while (unvisited.Count > 0)
            {
                var current = unvisited.OrderBy(n => distances[n]).First();

                if (distances[current] == int.MaxValue) break;

                unvisited.Remove(current);
                AddStep(new List<string> { current }, new List<GraphEdge>(),
                    $"Processing node {current} with distance {distances[current]}", distances);

                if (current == endNode) break;

                var neighbors = graph.Edges
                    .Where(e => e.Source == current || (!e.IsDirected && e.Target == current))
                    .ToList();

                foreach (var edge in neighbors)
                {
                    var neighbor = edge.Source == current ? edge.Target : edge.Source;

                    if (!unvisited.Contains(neighbor)) continue;

                    var alt = distances[current] + edge.Weight;

                    if (alt < distances[neighbor])
                    {
                        distances[neighbor] = alt;
                        previous[neighbor] = current;

                        AddStep(new List<string> { current, neighbor }, new List<GraphEdge> { edge },
                            $"Updated distance to {neighbor}: {alt}", distances);
                    }
                }
            }

            // Reconstruct path
            var path = new List<string>();
            var pathNode = endNode;
            while (previous.ContainsKey(pathNode))
            {
                path.Insert(0, pathNode);
                pathNode = previous[pathNode];
            }
            if (distances[endNode] != int.MaxValue)
            {
                path.Insert(0, startNode);
            }

            AddStep(path, new List<GraphEdge>(),
                $"Shortest path found! Distance: {distances[endNode]}", distances);

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Dijkstra's Shortest Path",
                Result = new Dictionary<string, object>
                {
                    { "ShortestPath", path },
                    { "Distance", distances[endNode] },
                    { "AllDistances", distances }
                }
            };
        }

        public GraphAlgorithmResponse PrimMST(Graph graph, string startNode)
        {
            _steps = new();
            var mstEdges = new List<GraphEdge>();
            var visited = new HashSet<string> { startNode };
            var totalWeight = 0;

            AddStep(new List<string> { startNode }, new List<GraphEdge>(),
                $"Starting Prim's algorithm from {startNode}");

            while (visited.Count < graph.Nodes.Count)
            {
                GraphEdge? minEdge = null;
                int minWeight = int.MaxValue;

                foreach (var node in visited)
                {
                    var edges = graph.Edges.Where(e =>
                        (e.Source == node && !visited.Contains(e.Target)) ||
                        (!e.IsDirected && e.Target == node && !visited.Contains(e.Source)));

                    foreach (var edge in edges)
                    {
                        if (edge.Weight < minWeight)
                        {
                            minWeight = edge.Weight;
                            minEdge = edge;
                        }
                    }
                }

                if (minEdge == null) break;

                mstEdges.Add(minEdge);
                totalWeight += minEdge.Weight;

                var newNode = visited.Contains(minEdge.Source) ? minEdge.Target : minEdge.Source;
                visited.Add(newNode);

                AddStep(visited.ToList(), mstEdges,
                    $"Added edge {minEdge.Source}-{minEdge.Target} (weight: {minEdge.Weight})");
            }

            AddStep(visited.ToList(), mstEdges,
                $"MST Complete! Total weight: {totalWeight}");

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Prim's Minimum Spanning Tree",
                Result = new Dictionary<string, object>
                {
                    { "MSTEdges", mstEdges },
                    { "TotalWeight", totalWeight }
                }
            };
        }

        public GraphAlgorithmResponse TopologicalSortDFS(Graph graph)
        {
            _steps = new();
            var visited = new HashSet<string>();
            var stack = new Stack<string>();

            AddStep(new List<string>(), new List<GraphEdge>(), "Starting Topological Sort (DFS)");

            foreach (var node in graph.Nodes)
            {
                if (!visited.Contains(node.Id))
                {
                    TopologicalSortDFSUtil(graph, node.Id, visited, stack);
                }
            }

            var result = stack.ToList();
            AddStep(result, new List<GraphEdge>(), $"Topological order: {string.Join(" -> ", result)}");

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Topological Sort (DFS)",
                Result = new Dictionary<string, object>
                {
                    { "TopologicalOrder", result }
                }
            };
        }

        private void TopologicalSortDFSUtil(Graph graph, string node, HashSet<string> visited, Stack<string> stack)
        {
            visited.Add(node);
            AddStep(visited.ToList(), new List<GraphEdge>(), $"Visiting node {node}");

            var neighbors = graph.Edges
                .Where(e => e.Source == node && e.IsDirected)
                .Select(e => e.Target)
                .ToList();

            foreach (var neighbor in neighbors)
            {
                if (!visited.Contains(neighbor))
                {
                    TopologicalSortDFSUtil(graph, neighbor, visited, stack);
                }
            }

            stack.Push(node);
            AddStep(visited.ToList(), new List<GraphEdge>(), $"Added {node} to stack");
        }

        private void AddStep(List<string> visitedNodes, List<GraphEdge> highlightedEdges,
            string description, Dictionary<string, int>? distances = null)
        {
            _steps.Add(new GraphAlgorithmStep
            {
                StepNumber = _steps.Count + 1,
                VisitedNodes = new List<string>(visitedNodes),
                HighlightedEdges = new List<GraphEdge>(highlightedEdges),
                Description = description,
                NodeDistances = distances != null ? new Dictionary<string, int>(distances) : new()
            });
        } 
    }
}