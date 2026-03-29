import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

function DraggableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {id}
    </div>
  );
}

function Column({ id, items }: { id: string; items: string[] }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef}>
      <h3>{id}</h3>
      {items.map((item) => (
        <DraggableItem key={item} id={item} />
      ))}
    </div>
  );
}

export default function Board() {
  return (
    <DndContext collisionDetection={closestCenter}>
      <Column id="todo" items={["task-1", "task-2"]} />
      <Column id="done" items={["task-3"]} />
    </DndContext>
  );
}