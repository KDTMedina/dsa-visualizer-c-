using Microsoft.AspNetCore.Mvc;
using DSAVisualizer.Models;
using DSAVisualizer.Services;

namespace DSAVisualizer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SortingController : ControllerBase
    {
        private readonly SortingService _sortingService;

        public SortingController()
        {
            _sortingService = new SortingService();
        }

        [HttpPost("bubble")]
        public ActionResult<AlgorithmResponse> BubbleSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.BubbleSort(request.Array);
            return Ok(result);
        }

        [HttpPost("selection")]
        public ActionResult<AlgorithmResponse> SelectionSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.SelectionSort(request.Array);
            return Ok(result);
        }

        [HttpPost("insertion")]
        public ActionResult<AlgorithmResponse> InsertionSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.InsertionSort(request.Array);
            return Ok(result);
        }

        [HttpPost("merge")]
        public ActionResult<AlgorithmResponse> MergeSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.MergeSort(request.Array);
            return Ok(result);
        }

        [HttpPost("quick")]
        public ActionResult<AlgorithmResponse> QuickSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.QuickSort(request.Array);
            return Ok(result);
        }

        [HttpPost("heap")]
        public ActionResult<AlgorithmResponse> HeapSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.HeapSort(request.Array);
            return Ok(result);
        }

        [HttpGet("algorithms")]
        public ActionResult<List<string>> GetAlgorithms()
        {
            return Ok(new List<string>
            {
                "bubble",
                "selection",
                "insertion",
                "merge",
                "quick",
                "heap",
                "shell",
                "counting",
                "bucket",
                "radix"
            });
        }

        [HttpPost("shell")]
        public ActionResult<AlgorithmResponse> ShellSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.ShellSort(request.Array);
            return Ok(result);
        }

        [HttpPost("counting")]
        public ActionResult<AlgorithmResponse> CountingSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.CountingSort(request.Array);
            return Ok(result);
        }

        [HttpPost("bucket")]
        public ActionResult<AlgorithmResponse> BucketSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.BucketSort(request.Array);
            return Ok(result);
        }

        [HttpPost("radix")]
        public ActionResult<AlgorithmResponse> RadixSort([FromBody] SortRequest request)
        {
            if (request.Array == null || request.Array.Count == 0)
            {
                return BadRequest("Array cannot be empty");
            }

            var result = _sortingService.RadixSort(request.Array);
            return Ok(result);
        }
    }
}