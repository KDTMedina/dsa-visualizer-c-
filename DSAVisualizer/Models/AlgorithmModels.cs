namespace DSAVisualizer.Models
{
    // Base response model for algorithm execution
    public class AlgorithmResponse
    {
        public List<AlgorithmStep> Steps { get; set; } = new();
        public string AlgorithmName { get; set; } = string.Empty;
        public int Comparisons { get; set; }
        public int Swaps { get; set; }
        public long ExecutionTimeMs { get; set; }
    }

    // Represents a single step in algorithm execution
    public class AlgorithmStep
    {
        public int StepNumber { get; set; }
        public List<int> Array { get; set; } = new();
        public string Description { get; set; } = string.Empty;
        public List<int> HighlightIndices { get; set; } = new();
        public string HighlightColor { get; set; } = "yellow";
    }

    // Graph representation
    public class Graph
    {
        public List<GraphNode> Nodes { get; set; } = new();
        public List<GraphEdge> Edges { get; set; } = new();
    }

    public class GraphNode
    {
        public string Id { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public double X { get; set; }
        public double Y { get; set; }
    }

    public class GraphEdge
    {
        public string Source { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public int Weight { get; set; }
        public bool IsDirected { get; set; }
    }

    // Graph algorithm response
    public class GraphAlgorithmResponse
    {
        public List<GraphAlgorithmStep> Steps { get; set; } = new();
        public string AlgorithmName { get; set; } = string.Empty;
        public Dictionary<string, object> Result { get; set; } = new();
    }

    public class GraphAlgorithmStep
    {
        public int StepNumber { get; set; }
        public List<string> VisitedNodes { get; set; } = new();
        public List<GraphEdge> HighlightedEdges { get; set; } = new();
        public string Description { get; set; } = string.Empty;
        public Dictionary<string, int> NodeDistances { get; set; } = new();
    }

    // Heap visualization
    public class HeapNode
    {
        public int Value { get; set; }
        public int Index { get; set; }
        public HeapNode? Left { get; set; }
        public HeapNode? Right { get; set; }
    }

    // Request models
    public class SortRequest
    {
        public List<int> Array { get; set; } = new();
        public string Algorithm { get; set; } = string.Empty;
    }

    public class GraphRequest
    {
        public Graph Graph { get; set; } = new();
        public string Algorithm { get; set; } = string.Empty;
        public string? StartNode { get; set; }
        public string? EndNode { get; set; }
    }

    public class HeapRequest
    {
        public List<int> Array { get; set; } = new();
        public string HeapType { get; set; } = "MinHeap";
    }
}