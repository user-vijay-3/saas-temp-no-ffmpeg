import React from 'react';
import { type SubtitleStyle } from '../types';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface StyleEditorProps {
  style: SubtitleStyle;
  onUpdateStyle: (style: SubtitleStyle) => void;
}

export function StyleEditor({ style, onUpdateStyle }: StyleEditorProps) {
  const fontOptions = [
    'Arial', 'Times New Roman', 'Helvetica', 'Courier New', 'Georgia', 'Verdana',
    'Comic Sans MS', 'Impact', 'Tahoma', 'Trebuchet MS'
  ];

  const alignmentOptions = [
    { value: "1", label: "Top Left" },
    { value: "2", label: "Top Center" },
    { value: "3", label: "Top Right" },
    { value: "4", label: "Middle Left" },
    { value: "5", label: "Middle Center" },
    { value: "6", label: "Middle Right" },
    { value: "7", label: "Bottom Left" },
    { value: "8", label: "Bottom Center" },
    { value: "9", label: "Bottom Right" },
  ];

  return (
    <Card className="h-full border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Style Editor</CardTitle>
          <Badge variant="secondary">ASS Compatible</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="font" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="font">Font</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="font" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={style.fontName}
                  onValueChange={(value) => onUpdateStyle({ ...style, fontName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Font Size</Label>
                  <span className="text-sm text-muted-foreground">{style.fontSize}px</span>
                </div>
                <Slider
                  value={[style.fontSize]}
                  min={8}
                  max={72}
                  step={1}
                  onValueChange={(value) => onUpdateStyle({ ...style, fontSize: value[0] })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Position X</Label>
                    <span className="text-sm text-muted-foreground">{style.positionX}%</span>
                  </div>
                  <Slider
                    value={[style.positionX]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => onUpdateStyle({ ...style, positionX: value[0] })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Position Y</Label>
                    <span className="text-sm text-muted-foreground">{style.positionY}%</span>
                  </div>
                  <Slider
                    value={[style.positionY]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => onUpdateStyle({ ...style, positionY: value[0] })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={style.bold ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateStyle({ ...style, bold: !style.bold })}
                  >
                    B
                  </Button>
                  <Button
                    variant={style.italic ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateStyle({ ...style, italic: !style.italic })}
                  >
                    I
                  </Button>
                  <Button
                    variant={style.underline ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateStyle({ ...style, underline: !style.underline })}
                  >
                    U
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Primary Color</Label>
                  <span className="text-sm text-muted-foreground">{style.primaryColor}</span>
                </div>
                <Input
                  type="color"
                  value={style.primaryColor}
                  onChange={(e) => onUpdateStyle({ ...style, primaryColor: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Secondary Color</Label>
                  <Switch
                    checked={style.useSecondaryColor}
                    onCheckedChange={(checked) => onUpdateStyle({ ...style, useSecondaryColor: checked })}
                  />
                </div>
                {style.useSecondaryColor && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{style.secondaryColor}</span>
                    </div>
                    <Input
                      type="color"
                      value={style.secondaryColor}
                      onChange={(e) => onUpdateStyle({ ...style, secondaryColor: e.target.value })}
                      className="h-10"
                    />
                  </>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Background Color</Label>
                  <Switch
                    checked={style.useBackColor}
                    onCheckedChange={(checked) => onUpdateStyle({ ...style, useBackColor: checked })}
                  />
                </div>
                {style.useBackColor && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{style.backColor}</span>
                    </div>
                    <Input
                      type="color"
                      value={style.backColor}
                      onChange={(e) => onUpdateStyle({ ...style, backColor: e.target.value })}
                      className="h-10"
                    />
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Outline Width</Label>
                  <span className="text-sm text-muted-foreground">{style.outline}px</span>
                </div>
                <Slider
                  value={[style.outline]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => onUpdateStyle({ ...style, outline: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Shadow Depth</Label>
                  <span className="text-sm text-muted-foreground">{style.shadow}px</span>
                </div>
                <Slider
                  value={[style.shadow]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => onUpdateStyle({ ...style, shadow: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <Select
                  value={style.alignment.toString()}
                  onValueChange={(value) => onUpdateStyle({ ...style, alignment: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {alignmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}