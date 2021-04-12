import { ensure, range } from './util';
import { Maze } from './maze';

export class MazeNode
{
  public x: number;
  public y: number;
  public z: number;
  public parents: MazeNode;
  public children: Array<MazeNode>;
  public weight: number;

  constructor(x: number, y: number, z: number)
  {
    this.x = x;
    this.y = y;
    this.z = z;
    this.parents = this;
    this.children = [];
    this.weight = 0;
  }

  isEqual(node: MazeNode): boolean
  {
    return (this.x === node.x) && (this.y === node.y) &&
      (this.z === node.z);
  }

  getNeighbourhood(): Array<MazeNode>
  {
    if (this.isEqual(this.parents))
    {
      return this.children;
    } else {
      return this.children.concat([this.parents]);
    }
  }

  possibleNeighbourhood(): Array<MazeNode>
  {
    return [
      new MazeNode(this.x - 1, this.y, this.z),
      new MazeNode(this.x + 1, this.y, this.z),
      new MazeNode(this.x, this.y - 1, this.z),
      new MazeNode(this.x, this.y + 1, this.z),
      new MazeNode(this.x, this.y, this.z - 1),
      new MazeNode(this.x, this.y, this.z + 1),
    ];
  }

  sameX(maze: Maze): Array<MazeNode>
  {
    let xs: Array<number> = range(0, maze.getWidth());
    let y = this.y;
    let z = this.z;
    return xs.map(x => new MazeNode(x, y, z))
      .filter(node => !node.isEqual(this));
  }

  sameY(maze: Maze): Array<MazeNode>
  {
    let x = this.x;
    let ys: Array<number> = range(0, maze.getHeight());
    let z = this.z;
    return ys.map(y => new MazeNode(x, y, z))
      .filter(node => !node.isEqual(this));
  }

  between(node: MazeNode): Array<MazeNode>
  {
    let nodes: Array<MazeNode> = [];
    if (this.x === node.x)
    {
      let ys: Array<number>;
      if (this.y < node.y)
      {
        ys = range(node.y - 1, this.y, -1);
      } else {
        ys = range(node.y + 1, this.y);
      }
      for (let y of ys)
      {
        nodes.push(new MazeNode(this.x, y, this.z));
      }
    } else if (this.y === node.y) {
      let xs: Array<number>;
      if (this.x < node.x)
      {
        xs = range(node.x - 1, this.x, -1);
      } else {
        xs = range(node.x + 1, this.x);
      }
      for (let x of xs)
      {
        nodes.push(new MazeNode(x, this.y, this.z));
      }
    }
    return nodes;
  }

  toString(): string
  {
    return '('.concat(this.x.toString()).concat(', ').concat(this.y.toString())
      .concat(', ').concat(this.z.toString()).concat(')');
  }
}

export function bfs(root: MazeNode): MazeNode
{
  root.weight = 0;
  let queue: Array<MazeNode> = [root];
  let currentMazeNode: MazeNode;
  let visited: Array<MazeNode> = [root];
  while (queue.length > 0)
  {
    currentMazeNode = queue.splice(0, 1)[0];
    for (let neighbour of currentMazeNode.getNeighbourhood())
    {
      if (!visited.some(element => neighbour.isEqual(element)))
      {
        neighbour.weight = currentMazeNode.weight + 1;
        visited.push(neighbour);
        queue.push(neighbour);
      }
    }
  }
  return visited[visited.length - 1];
}