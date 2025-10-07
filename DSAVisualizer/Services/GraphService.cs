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

        public GraphAlgorithmResponse KruskalMST(Graph graph)
        {
            _steps = new();
            var mstEdges = new List<GraphEdge>();
            var parent = new Dictionary<string, string>();
            var rank = new Dictionary<string, int>();
            var totalWeight = 0;

            // Initialize union-find
            foreach (var node in graph.Nodes)
            {
                parent[node.Id] = node.Id;
                rank[node.Id] = 0;
            }

            AddStep(new List<string>(), new List<GraphEdge>(), "Starting Kruskal's algorithm");

            // Sort edges by weight
            var sortedEdges = graph.Edges.OrderBy(e => e.Weight).ToList();

            foreach (var edge in sortedEdges)
            {
                string rootSource = Find(parent, edge.Source);
                string rootTarget = Find(parent, edge.Target);

                AddStep(new List<string> { edge.Source, edge.Target }, new List<GraphEdge> { edge },
                    $"Checking edge {edge.Source}-{edge.Target} (weight: {edge.Weight})");

                if (rootSource != rootTarget)
                {
                    mstEdges.Add(edge);
                    totalWeight += edge.Weight;
                    Union(parent, rank, rootSource, rootTarget);

                    AddStep(graph.Nodes.Select(n => n.Id).ToList(), mstEdges,
                        $"Added edge {edge.Source}-{edge.Target} to MST");
                }
                else
                {
                    AddStep(new List<string>(), mstEdges,
                        $"Skipped edge {edge.Source}-{edge.Target} (would create cycle)");
                }
            }

            AddStep(graph.Nodes.Select(n => n.Id).ToList(), mstEdges,
                $"Kruskal's MST Complete! Total weight: {totalWeight}");

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Kruskal's Minimum Spanning Tree",
                Result = new Dictionary<string, object>
        {
            { "MSTEdges", mstEdges },
            { "TotalWeight", totalWeight }
        }
            };
        }

        private string Find(Dictionary<string, string> parent, string node)
        {
            if (parent[node] != node)
            {
                parent[node] = Find(parent, parent[node]);
            }
            return parent[node];
        }

        private void Union(Dictionary<string, string> parent, Dictionary<string, int> rank,
            string root1, string root2)
        {
            if (rank[root1] < rank[root2])
            {
                parent[root1] = root2;
            }
            else if (rank[root1] > rank[root2])
            {
                parent[root2] = root1;
            }
            else
            {
                parent[root2] = root1;
                rank[root1]++;
            }
        }

        public GraphAlgorithmResponse FloydWarshall(Graph graph)
        {
            _steps = new();
            var nodes = graph.Nodes.Select(n => n.Id).ToList();
            var dist = new Dictionary<string, Dictionary<string, int>>();

            // Initialize distances
            foreach (var node1 in nodes)
            {
                dist[node1] = new Dictionary<string, int>();
                foreach (var node2 in nodes)
                {
                    if (node1 == node2)
                        dist[node1][node2] = 0;
                    else
                        dist[node1][node2] = int.MaxValue / 2;
                }
            }

            // Set edge weights
            foreach (var edge in graph.Edges)
            {
                dist[edge.Source][edge.Target] = edge.Weight;
                if (!edge.IsDirected)
                {
                    dist[edge.Target][edge.Source] = edge.Weight;
                }
            }

            AddStep(new List<string>(), new List<GraphEdge>(),
                "Starting Floyd-Warshall algorithm", ConvertToSingleDict(dist, nodes));

            // Floyd-Warshall algorithm
            foreach (var k in nodes)
            {
                foreach (var i in nodes)
                {
                    foreach (var j in nodes)
                    {
                        if (dist[i][k] != int.MaxValue / 2 && dist[k][j] != int.MaxValue / 2)
                        {
                            if (dist[i][j] > dist[i][k] + dist[k][j])
                            {
                                dist[i][j] = dist[i][k] + dist[k][j];

                                AddStep(new List<string> { i, k, j }, new List<GraphEdge>(),
                                    $"Updated distance from {i} to {j} via {k}: {dist[i][j]}",
                                    ConvertToSingleDict(dist, nodes));
                            }
                        }
                    }
                }
            }

            AddStep(nodes, new List<GraphEdge>(), "Floyd-Warshall Complete!",
                ConvertToSingleDict(dist, nodes));

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Floyd-Warshall All Pairs Shortest Paths",
                Result = new Dictionary<string, object>
        {
            { "AllPairsDistances", dist }
        }
            };
        }

        private Dictionary<string, int> ConvertToSingleDict(
            Dictionary<string, Dictionary<string, int>> dist, List<string> nodes)
        {
            var result = new Dictionary<string, int>();
            foreach (var node in nodes)
            {
                if (dist.ContainsKey(node))
                {
                    foreach (var kvp in dist[node])
                    {
                        if (kvp.Value != int.MaxValue / 2)
                        {
                            result[$"{node}->{kvp.Key}"] = kvp.Value;
                        }
                    }
                }
            }
            return result;
        }

        public GraphAlgorithmResponse ConnectedComponents(Graph graph)
        {
            _steps = new();
            var visited = new HashSet<string>();
            var components = new List<List<string>>();
            var componentId = 0;

            AddStep(new List<string>(), new List<GraphEdge>(),
                "Finding connected components");

            foreach (var node in graph.Nodes)
            {
                if (!visited.Contains(node.Id))
                {
                    var component = new List<string>();
                    DFSComponent(graph, node.Id, visited, component);
                    components.Add(component);

                    AddStep(visited.ToList(), new List<GraphEdge>(),
                        $"Found component {componentId + 1}: {string.Join(", ", component)}");
                    componentId++;
                }
            }

            AddStep(visited.ToList(), new List<GraphEdge>(),
                $"Total components found: {components.Count}");

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Connected Components",
                Result = new Dictionary<string, object>
        {
            { "Components", components },
            { "ComponentCount", components.Count }
        }
            };
        }

        private void DFSComponent(Graph graph, string node, HashSet<string> visited, List<string> component)
        {
            visited.Add(node);
            component.Add(node);

            var neighbors = graph.Edges
                .Where(e => e.Source == node || (!e.IsDirected && e.Target == node))
                .Select(e => e.Source == node ? e.Target : e.Source)
                .ToList();

            foreach (var neighbor in neighbors)
            {
                if (!visited.Contains(neighbor))
                {
                    DFSComponent(graph, neighbor, visited, component);
                }
            }
        }

        public GraphAlgorithmResponse TopologicalSortIndegree(Graph graph)
        {
            _steps = new();
            var indegree = new Dictionary<string, int>();
            var result = new List<string>();

            // Initialize indegree
            foreach (var node in graph.Nodes)
            {
                indegree[node.Id] = 0;
            }

            // Calculate indegree
            foreach (var edge in graph.Edges)
            {
                if (edge.IsDirected)
                {
                    indegree[edge.Target]++;
                }
            }

            AddStep(new List<string>(), new List<GraphEdge>(),
                "Starting Topological Sort (Indegree method)", indegree);

            var queue = new Queue<string>();
            foreach (var node in indegree.Where(kvp => kvp.Value == 0))
            {
                queue.Enqueue(node.Key);
            }

            while (queue.Count > 0)
            {
                var node = queue.Dequeue();
                result.Add(node);

                AddStep(result, new List<GraphEdge>(),
                    $"Processed node {node}", indegree);

                var neighbors = graph.Edges
                    .Where(e => e.Source == node && e.IsDirected)
                    .Select(e => e.Target)
                    .ToList();

                foreach (var neighbor in neighbors)
                {
                    indegree[neighbor]--;
                    if (indegree[neighbor] == 0)
                    {
                        queue.Enqueue(neighbor);
                    }
                }
            }

            if (result.Count != graph.Nodes.Count)
            {
                AddStep(result, new List<GraphEdge>(),
                    "Graph has a cycle! Topological sort not possible.");
            }
            else
            {
                AddStep(result, new List<GraphEdge>(),
                    $"Topological order: {string.Join(" → ", result)}");
            }

            return new GraphAlgorithmResponse
            {
                Steps = _steps,
                AlgorithmName = "Topological Sort (Indegree)",
                Result = new Dictionary<string, object>
        {
            { "TopologicalOrder", result },
            { "HasCycle", result.Count != graph.Nodes.Count }
        }
            };
        }
    }
}