using Microsoft.AspNetCore.Mvc;
using DSAVisualizer.Models;
using DSAVisualizer.Services;

namespace DSAVisualizer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GraphController : ControllerBase
    {
        private readonly GraphService _graphService;

        public GraphController()
        {
            _graphService = new GraphService();
        }

        [HttpPost("bfs")]
        public ActionResult<GraphAlgorithmResponse> BreadthFirstSearch([FromBody] GraphRequest request)
        {
            if (request.Graph == null || string.IsNullOrEmpty(request.StartNode))
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.BreadthFirstSearch(request.Graph, request.StartNode);
            return Ok(result);
        }

        [HttpPost("dfs")]
        public ActionResult<GraphAlgorithmResponse> DepthFirstSearch([FromBody] GraphRequest request)
        {
            if (request.Graph == null || string.IsNullOrEmpty(request.StartNode))
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.DepthFirstSearch(request.Graph, request.StartNode);
            return Ok(result);
        }

        [HttpPost("dijkstra")]
        public ActionResult<GraphAlgorithmResponse> DijkstraShortestPath([FromBody] GraphRequest request)
        {
            if (request.Graph == null || string.IsNullOrEmpty(request.StartNode) || 
                string.IsNullOrEmpty(request.EndNode))
            {
                return BadRequest("Start and end nodes are required");
            }

            var result = _graphService.DijkstraShortestPath(request.Graph, request.StartNode, request.EndNode);
            return Ok(result);
        }

        [HttpPost("prim")]
        public ActionResult<GraphAlgorithmResponse> PrimMST([FromBody] GraphRequest request)
        {
            if (request.Graph == null || string.IsNullOrEmpty(request.StartNode))
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.PrimMST(request.Graph, request.StartNode);
            return Ok(result);
        }

        [HttpPost("topological-dfs")]
        public ActionResult<GraphAlgorithmResponse> TopologicalSortDFS([FromBody] GraphRequest request)
        {
            if (request.Graph == null)
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.TopologicalSortDFS(request.Graph);
            return Ok(result);
        }

        [HttpGet("algorithms")]
        public ActionResult<List<string>> GetAlgorithms()
        {
            return Ok(new List<string>
            {
                "bfs",
                "dfs",
                "dijkstra",
                "prim",
                "kruskal",
                "topological-dfs",
                "topological-indegree",
                "floyd-warshall",
                "connected-components"
            });
        }

        [HttpPost("kruskal")]
        public ActionResult<GraphAlgorithmResponse> KruskalMST([FromBody] GraphRequest request)
        {
            if (request.Graph == null)
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.KruskalMST(request.Graph);
            return Ok(result);
        }

        [HttpPost("floyd-warshall")]
        public ActionResult<GraphAlgorithmResponse> FloydWarshall([FromBody] GraphRequest request)
        {
            if (request.Graph == null)
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.FloydWarshall(request.Graph);
            return Ok(result);
        }

        [HttpPost("connected-components")]
        public ActionResult<GraphAlgorithmResponse> ConnectedComponents([FromBody] GraphRequest request)
        {
            if (request.Graph == null)
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.ConnectedComponents(request.Graph);
            return Ok(result);
        }

        [HttpPost("topological-indegree")]
        public ActionResult<GraphAlgorithmResponse> TopologicalSortIndegree([FromBody] GraphRequest request)
        {
            if (request.Graph == null)
            {
                return BadRequest("Invalid request");
            }

            var result = _graphService.TopologicalSortIndegree(request.Graph);
            return Ok(result);
        }
    }
}