"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconPhoto, IconFileDescription, IconCloudUpload } from "@tabler/icons-react"

interface StepDetailsProps {
  description: string
  onDescriptionChange: (description: string) => void
}

export function StepDetails({ description, onDescriptionChange }: StepDetailsProps) {
  const charCount = description.length
  const maxChars = 500
  
  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <IconFileDescription className="size-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Description de la propriété
            </Label>
            <p className="text-sm text-muted-foreground">
              Décrivez les caractéristiques principales
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className={cn(
              "min-h-[150px] rounded-xl border-border/50 bg-background p-4 resize-none",
              "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
              "transition-all duration-200"
            )}
            placeholder="Décrivez la propriété : équipements, caractéristiques, environnement..."
            maxLength={maxChars}
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {charCount}/{maxChars}
          </div>
        </div>
      </div>
      
      {/* Photo Upload Zone */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <IconPhoto className="size-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <Label className="text-base font-medium">
              Photos de la propriété
            </Label>
            <p className="text-sm text-muted-foreground">
              Ajoutez jusqu'à 10 photos (optionnel)
            </p>
          </div>
        </div>
        
        <div className={cn(
          "relative rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 p-8",
          "hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/10",
          "transition-all duration-300 cursor-pointer"
        )}>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 mb-4">
              <IconCloudUpload className="size-7 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="font-medium">Glissez vos photos ici</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ou <span className="text-orange-600 hover:underline">parcourez vos fichiers</span>
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              PNG, JPG ou WEBP • Max 5MB par image
            </p>
          </div>
          
          {/* Hidden file input */}
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/png,image/jpeg,image/webp"
            multiple
          />
        </div>
      </div>
      
      {/* Tips */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <p className="text-sm font-medium mb-2">💡 Conseils pour de bonnes photos :</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Prenez des photos en lumière naturelle</li>
          <li>Montrez toutes les pièces principales</li>
          <li>Incluez une photo de la façade extérieure</li>
        </ul>
      </div>
    </div>
  )
}


