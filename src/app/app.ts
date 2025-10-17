import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.html",
})
export class App {
  protected readonly title = signal("angular-recipe-planner");
  protected readonly cn = cn;
}
